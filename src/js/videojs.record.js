/**
 * @file videojs.record.js
 *
 * The main file for the videojs-record project.
 * MIT license: https://github.com/collab-project/videojs-record/blob/master/LICENSE
 */

import AnimationDisplay from './controls/animation-display';
import RecordCanvas from './controls/record-canvas';
import DeviceButton from './controls/device-button';
import CameraButton from './controls/camera-button';
import RecordToggle from './controls/record-toggle';
import RecordIndicator from './controls/record-indicator';
import * as engine from './engine/record-engine';
import RecordRTCEngine from './engine/record-rtc';
import pluginDefaultOptions from './defaults';
import formatTime from './utils/format-time';
import setSrcObject from './utils/browser-shim';
import { detectBrowser, isChrome } from './utils/detect-browser';
import getRecorderMode from './utils/record-mode';

import videojs from 'video.js';

const Plugin = videojs.getPlugin('plugin');
const Player = videojs.getComponent('Player');
const Component = videojs.getComponent('Component');

const AUTO = 'auto';


// monkey-patch play (#152)
Player.prototype.play = function play() {
    var retval = this.techGet_('play');
    // silence errors (unhandled promise from play)
    if (retval !== undefined && typeof retval.then === 'function') {
        retval.then(null, function (e){});
    }
    return retval;
};

/**
 * Record audio/video/images using the Video.js player.
 *
 * @class
 * @augments videojs.Plugin
 */
class Recorder extends Plugin {
    /**
     * The constructor function for the class.
     *
     * @param {(videojs.Player|Object)} player
     * @param {Object} options - Player options.
     */
    constructor(player, options) {
        super(player, options);

        // setup plugin options
        this.loadOptions();

        // (re)set recorder state
        this.resetState();

        // wait until player ui is ready
        this.player.one('ready', this.setupUI.bind(this));
    }

    /**
     * Setup plugin options.
     */
    loadOptions() {
        let recordOptions = videojs.mergeOptions(pluginDefaultOptions,
            this.player.options_.plugins.record);

        // record settings
        this.recordImage = recordOptions.image;
        this.recordAudio = recordOptions.audio;
        this.recordVideo = recordOptions.video;
        this.recordAnimation = recordOptions.animation;
        this.maxLength = recordOptions.maxLength;
        this.debug = recordOptions.debug;
        this.recordTimeSlice = recordOptions.timeSlice;

        // video/canvas settings
        this.videoFrameWidth = recordOptions.frameWidth;
        this.videoFrameHeight = recordOptions.frameHeight;
        this.videoRecorderType = recordOptions.videoRecorderType;
        this.videoMimeType = recordOptions.videoMimeType;

        // audio settings
        this.audioEngine = recordOptions.audioEngine;
        this.audioRecorderType = recordOptions.audioRecorderType;
        this.audioWorkerURL = recordOptions.audioWorkerURL;
        this.audioBufferSize = recordOptions.audioBufferSize;
        this.audioSampleRate = recordOptions.audioSampleRate;
        this.audioChannels = recordOptions.audioChannels;
        this.audioMimeType = recordOptions.audioMimeType;

        // animation settings
        this.animationFrameRate = recordOptions.animationFrameRate;
        this.animationQuality = recordOptions.animationQuality;
    }

    /**
     * Player UI is ready.
     * @private
     */
    setupUI() {
        // insert custom controls on left-side of controlbar
        this.player.controlBar.addChild(this.player.cameraButton);
        this.player.controlBar.el().insertBefore(
            this.player.cameraButton.el(),
            this.player.controlBar.el().firstChild);
        this.player.controlBar.el().insertBefore(
            this.player.recordToggle.el(),
            this.player.controlBar.el().firstChild);

        // get rid of unused controls
        if (this.player.controlBar.remainingTimeDisplay !== undefined) {
            this.player.controlBar.remainingTimeDisplay.el().style.display = 'none';
        }
        if (this.player.controlBar.liveDisplay !== undefined) {
            this.player.controlBar.liveDisplay.el().style.display = 'none';
        }

        // loop feature is never used in this plugin
        this.player.loop(false);

        // tweak player UI based on type
        switch (this.getRecordType()) {
            case engine.AUDIO_ONLY:
                // reference to videojs-wavesurfer plugin
                this.surfer = this.player.waveform;
                break;

            case engine.IMAGE_ONLY:
            case engine.VIDEO_ONLY:
            case engine.AUDIO_VIDEO:
            case engine.ANIMATION:
                // customize controls
                this.player.bigPlayButton.hide();

                // the native controls don't work for this UI so disable
                // them no matter what
                if (this.player.usingNativeControls_ === true) {
                    if (this.player.tech_.el_ !== undefined) {
                        this.player.tech_.el_.controls = false;
                    }
                }

                if (this.player.options_.controls) {
                    // progress control isn't used by this plugin
                    this.player.controlBar.progressControl.hide();

                    // prevent controlbar fadeout
                    this.player.on('userinactive', function(event) {
                        this.player.userActive(true);
                    }.bind(this));

                    // videojs automatically hides the controls when no valid 'source'
                    // element is included in the video or audio tag. Don't. Ever again.
                    this.player.controlBar.show();
                    this.player.controlBar.el().style.display = 'flex';
                }
                break;
        }

        // disable time display events that constantly try to reset the current time
        // and duration values
        this.player.off('timeupdate');
        this.player.off('durationchange');
        this.player.off('loadedmetadata');

        // display max record time
        this.setDuration(this.maxLength);

        // hide play control
        this.player.controlBar.playToggle.hide();
    }

    /**
     * Indicates whether the plugin is currently recording or not.
     *
     * @return {boolean} Plugin currently recording or not.
     */
    isRecording() {
        return this._recording;
    }

    /**
     * Indicates whether the plugin is currently processing recorded data
     * or not.
     *
     * @return {boolean} Plugin processing or not.
     */
    isProcessing() {
        return this._processing;
    }

    /**
     * Indicates whether the plugin is destroyed or not.
     *
     * @return {boolean} Plugin destroyed or not.
     */
    isDestroyed() {
        return this.player && (this.player.children() === null);
    }

    /**
     * Open the browser's recording device selection dialog.
     */
    getDevice() {
        // define device callbacks once
        if (this.deviceReadyCallback === undefined) {
            this.deviceReadyCallback = this.onDeviceReady.bind(this);
        }
        if (this.deviceErrorCallback === undefined) {
            this.deviceErrorCallback = this.onDeviceError.bind(this);
        }
        if (this.engineStopCallback === undefined) {
            this.engineStopCallback = this.onRecordComplete.bind(this);
        }
        // ask the browser to give the user access to the media device
        // and get a stream reference in the callback function
        switch (this.getRecordType()) {
            case engine.AUDIO_ONLY:
                // setup microphone
                this.mediaType = {
                    audio: (this.audioRecorderType === AUTO) ? true : this.audioRecorderType,
                    video: false
                };
                // remove existing microphone listeners
                this.surfer.surfer.microphone.un('deviceReady',
                    this.deviceReadyCallback);
                this.surfer.surfer.microphone.un('deviceError',
                    this.deviceErrorCallback);

                // setup new microphone listeners
                this.surfer.surfer.microphone.on('deviceReady',
                    this.deviceReadyCallback);
                this.surfer.surfer.microphone.on('deviceError',
                    this.deviceErrorCallback);

                // disable existing playback events
                this.surfer.setupPlaybackEvents(false);

                // (re)set surfer liveMode
                this.surfer.liveMode = true;
                this.surfer.surfer.microphone.paused = false;

                // open browser device selection dialog
                this.surfer.surfer.microphone.start();
                break;

            case engine.IMAGE_ONLY:
            case engine.VIDEO_ONLY:
                // setup camera
                this.mediaType = {
                    audio: false,
                    video: (this.videoRecorderType === AUTO) ? true : this.videoRecorderType
                };
                navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: (this.getRecordType() === engine.IMAGE_ONLY) ? this.recordImage : this.recordVideo
                }).then(
                    this.onDeviceReady.bind(this)
                ).catch(
                    this.onDeviceError.bind(this)
                );
                break;

            case engine.AUDIO_VIDEO:
                // setup camera and microphone
                this.mediaType = {
                    audio: (this.audioRecorderType === AUTO) ? true : this.audioRecorderType,
                    video: (this.videoRecorderType === AUTO) ? true : this.videoRecorderType
                };
                navigator.mediaDevices.getUserMedia({
                    audio: this.recordAudio,
                    video: this.recordVideo
                }).then(
                    this.onDeviceReady.bind(this)
                ).catch(
                    this.onDeviceError.bind(this)
                );
                break;

            case engine.ANIMATION:
                // setup camera
                this.mediaType = {
                    // animated GIF
                    audio: false,
                    video: false,
                    gif: true
                };
                navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: this.recordAnimation
                }).then(
                    this.onDeviceReady.bind(this)
                ).catch(
                    this.onDeviceError.bind(this)
                );
                break;
        }
    }

    /**
     * Invoked when the device is ready.
     * @private
     * @param stream: LocalMediaStream instance.
     */
    onDeviceReady(stream) {
        this._deviceActive = true;

        // store reference to stream for stopping etc.
        this.stream = stream;

        // hide device selection button
        this.player.deviceButton.hide();

        // reset time (e.g. when stopDevice was used)
        this.setDuration(this.maxLength);
        this.setCurrentTime(0);

        // hide play/pause control (e.g. when stopDevice was used)
        this.player.controlBar.playToggle.hide();

        // reset playback listeners
        this.off(this.player, 'timeupdate', this.playbackTimeUpdate);
        this.off(this.player, 'pause', this.onPlayerPause);
        this.off(this.player, 'play', this.onPlayerStart);

        // setup recording engine
        if (this.getRecordType() !== engine.IMAGE_ONLY) {
            // currently libvorbis.js, recorder.js, opus-recorder and lamejs
            // are only supported in audio-only mode
            if (this.getRecordType() !== engine.AUDIO_ONLY &&
                (this.audioEngine === engine.LIBVORBISJS ||
                 this.audioEngine === engine.RECORDERJS ||
                 this.audioEngine === engine.LAMEJS ||
                 this.audioEngine === engine.OPUSRECORDER)) {
                throw new Error('Currently ' + this.audioEngine +
                    ' is only supported in audio-only mode.');
            }

            // get recorder class
            var EngineClass;
            switch (this.audioEngine) {
                case engine.RECORDRTC:
                    // RecordRTC.js (default)
                    EngineClass = videojs.RecordRTCEngine;
                    break;

                case engine.LIBVORBISJS:
                    // libvorbis.js
                    EngineClass = videojs.LibVorbisEngine;
                    break;

                case engine.RECORDERJS:
                    // recorder.js
                    EngineClass = videojs.RecorderjsEngine;
                    break;

                case engine.LAMEJS:
                    // lamejs
                    EngineClass = videojs.LamejsEngine;
                    break;

                case engine.OPUSRECORDER:
                    // opus-recorder
                    EngineClass = videojs.OpusRecorderEngine;
                    break;

                default:
                    // unknown engine
                    throw new Error('Unknown audioEngine: ' + this.audioEngine);
            }
            try {
                // connect stream to recording engine
                this.engine = new EngineClass(this.player, this.player.options_);
            }
            catch (err) {
                console.error(err);
                throw new Error('Could not load ' + this.audioEngine +
                    ' plugin');
            }

            // listen for events
            this.engine.on('recordComplete', this.engineStopCallback);

            // audio settings
            this.engine.bufferSize = this.audioBufferSize;
            this.engine.sampleRate = this.audioSampleRate;
            this.engine.audioChannels = this.audioChannels;
            this.engine.audioWorkerURL = this.audioWorkerURL;

            // mime type
            this.engine.mimeType = {
                video: this.videoMimeType,
                gif: 'image/gif'
            };
            if (this.audioMimeType !== null &&
                this.audioMimeType !== AUTO) {
                this.engine.mimeType.audio = this.audioMimeType;
            }

            // video/canvas settings
            this.engine.video = {
                width: this.videoFrameWidth,
                height: this.videoFrameHeight
            };
            this.engine.canvas = {
                width: this.videoFrameWidth,
                height: this.videoFrameHeight
            };

            // animated GIF settings
            this.engine.quality = this.animationQuality;
            this.engine.frameRate = this.animationFrameRate;

            // timeSlice
            if (this.recordTimeSlice && this.recordTimeSlice > 0) {
                this.engine.timeSlice = this.recordTimeSlice;
                this.engine.onTimeStamp = this.onTimeStamp.bind(this);
            }

            // initialize recorder
            this.engine.setup(this.stream, this.mediaType, this.debug);

            // show elements that should never be hidden in animation,
            // audio and/or video modus
            let element;
            var uiElements = [this.player.controlBar.currentTimeDisplay,
                              this.player.controlBar.timeDivider,
                              this.player.controlBar.durationDisplay];
            for (element in uiElements) {
                if (uiElements.hasOwnProperty(element)) {
                    uiElements[element].el().style.display = 'block';
                    uiElements[element].show();
                }
            }

            // show record button
            this.player.recordToggle.show();
        } else {
            // disable record indicator
            this.player.recordIndicator.disable();

            // setup UI for retrying snapshot (e.g. when stopDevice was
            // used)
            this.retrySnapshot();

            // reset and show camera button
            this.player.cameraButton.onStop();
            this.player.cameraButton.show();
        }

        // setup preview
        if (this.getRecordType() !== engine.AUDIO_ONLY) {
            // show live preview
            this.mediaElement = this.player.el().firstChild;
            this.mediaElement.controls = false;

            // mute incoming audio for feedback loops
            this.mediaElement.muted = true;

            // hide the volume bar while it's muted
            this.displayVolumeControl(false);

            // load stream
            this.load(this.stream);

            // stream loading is async, so we wait until it's ready to play the stream.
            let self = this;
            this.player.one('loadedmetadata', function()
            {
                // start stream
                self.mediaElement.play();

                // forward to listeners
                self.player.trigger('deviceReady');
            });
        } else {
            // forward to listeners
            this.player.trigger('deviceReady');
        }
    }

    /**
     * Invoked when an device error occurred.
     * @private
     */
    onDeviceError(code) {
        this._deviceActive = false;

        // store code
        this.player.deviceErrorCode = code;

        // forward error to player
        this.player.trigger('deviceError');
    }

    /**
     * Start recording.
     */
    start() {
        if (!this.isProcessing()) {
            this._recording = true;

            // hide play control
            this.player.controlBar.playToggle.hide();

            // start preview
            switch (this.getRecordType()) {
                case engine.AUDIO_ONLY:
                    // disable playback events
                    this.surfer.setupPlaybackEvents(false);

                    // start/resume live audio visualization
                    this.surfer.surfer.microphone.paused = false;
                    this.surfer.liveMode = true;
                    this.surfer.surfer.microphone.play();
                    break;

                case engine.VIDEO_ONLY:
                case engine.AUDIO_VIDEO:
                    // preview video stream in video element
                    this.startVideoPreview();
                    break;

                case engine.ANIMATION:
                    // hide the first frame
                    this.player.recordCanvas.hide();

                    // hide the animation
                    this.player.animationDisplay.hide();

                    // show preview video
                    this.mediaElement.style.display = 'block';

                    // for animations, capture the first frame
                    // that can be displayed as soon as recording
                    // is complete
                    this.captureFrame().then(function(result) {
                        // start video preview **after** capturing first frame
                        this.startVideoPreview();
                    }.bind(this));
                    break;
            }

            // start recording
            switch (this.getRecordType()) {
                case engine.IMAGE_ONLY:
                    // create snapshot
                    this.createSnapshot();

                    // notify UI
                    this.player.trigger('startRecord');
                    break;

                case engine.VIDEO_ONLY:
                case engine.AUDIO_VIDEO:
                case engine.ANIMATION:
                    // wait for media stream on video element to actually load
                    let self = this;
                    this.player.one('loadedmetadata', function() {
                        // start actually recording process.
                        self.startRecording();
                    });
                    break;

                default:
                    // all resources have already loaded, so we can start
                    // recording right away
                    this.startRecording();
                    break;
            }
        }
    }

    /**
     * Start recording.
     * @private
     */
    startRecording() {
        // register starting point
        this.paused = false;
        this.pauseTime = this.pausedTime = 0;
        this.startTime = new Date().getTime();

        // start countdown
        this.countDown = this.player.setInterval(
            this.onCountDown.bind(this), 100);

        // cleanup previous recording
        if (this.engine !== undefined) {
            this.engine.dispose();
        }

        // start recording stream
        this.engine.start();

        // notify UI
        this.player.trigger('startRecord');
    }

    /**
     * Stop recording.
     */
    stop() {
        if (!this.isProcessing()) {
            this._recording = false;
            this._processing = true;

            if (this.getRecordType() !== engine.IMAGE_ONLY) {
                // notify UI
                this.player.trigger('stopRecord');

                // stop countdown
                this.player.clearInterval(this.countDown);

                // stop recording stream (result will be available async)
                if (this.engine) {
                    this.engine.stop();
                }
            } else {
                if (this.player.recordedData) {
                    // notify listeners that image data is (already) available
                    this.player.trigger('finishRecord');
                }
            }
        }
    }

    /**
     * Stop device(s) and recording if active.
     */
    stopDevice() {
        if (this.isRecording()) {
            // stop stream once recorded data is available,
            // otherwise it'll break recording
            this.player.one('finishRecord', this.stopStream.bind(this));

            // stop recording
            this.stop();
        } else {
            // stop stream now, since there's no recorded data available
            this.stopStream();
        }
    }

    /**
     * Stop stream and device.
     */
    stopStream() {
        // stop stream and device
        if (this.stream) {
            this._deviceActive = false;

            if (this.getRecordType() === engine.AUDIO_ONLY) {
                // make the microphone plugin stop it's device
                this.surfer.surfer.microphone.stopDevice();
                return;
            }
            this.stream.getTracks().forEach(function(stream) {
                stream.stop();
            });
        }
    }

    /**
     * Pause recording.
     */
    pause() {
        if (!this.paused) {
            this.pauseTime = new Date().getTime();
            this.paused = true;

            this.engine.pause();
        }
    }

    /**
     * Resume recording.
     */
    resume() {
        if (this.paused) {
            this.pausedTime += new Date().getTime() - this.pauseTime;

            this.engine.resume();
            this.paused = false;
        }
    }

    /**
     * Invoked when recording completed and the resulting stream is
     * available.
     * @private
     */
    onRecordComplete() {
        // store reference to recorded stream data
        this.player.recordedData = this.engine.recordedData;

        // change the replay button back to a play button
        this.player.controlBar.playToggle.removeClass('vjs-ended');
        this.player.controlBar.playToggle.show();

        // notify listeners that data is available
        this.player.trigger('finishRecord');

        switch (this.getRecordType()) {
            case engine.AUDIO_ONLY:
                // pause player so user can start playback
                this.surfer.pause();

                // setup events for playback
                this.surfer.setupPlaybackEvents(true);

                // display loader
                this.player.loadingSpinner.show();

                // restore interaction with controls after waveform
                // rendering is complete
                this.surfer.surfer.once('ready', function() {
                    this._processing = false;
                }.bind(this));

                // visualize recorded stream
                this.load(this.player.recordedData);
                break;

            case engine.VIDEO_ONLY:
            case engine.AUDIO_VIDEO:
                // remove previous listeners
                this.off(this.player, 'pause', this.onPlayerPause);
                this.off(this.player, 'play', this.onPlayerStart);

                // pausing the player so we can visualize the recorded data
                // will trigger an async video.js 'pause' event that we
                // have to wait for.
                this.player.one('pause', function() {
                    // video data is ready
                    this._processing = false;

                    // hide loader
                    this.player.loadingSpinner.hide();

                    // show stream total duration
                    this.setDuration(this.streamDuration);

                    // update time during playback
                    this.on(this.player, 'timeupdate',
                        this.playbackTimeUpdate);

                    // because there are 2 separate data streams for audio
                    // and video in the Chrome browser, playback the audio
                    // stream in a new extra audio element and the video
                    // stream in the regular video.js player.
                    if (this.getRecordType() === engine.AUDIO_VIDEO &&
                        isChrome() && this.player.recordedData.audio) {
                        if (this.extraAudio === undefined) {
                            this.extraAudio = this.createEl('audio');
                            this.extraAudio.id = 'extraAudio';

                            // handle volume changes in extra audio
                            // for chrome
                            this.player.on('volumechange',
                                this.onVolumeChange.bind(this));
                        }
                        setSrcObject(this.player.recordedData.audio,
                            this.extraAudio, false);

                        // pause extra audio when player pauses
                        this.on(this.player, 'pause',
                            this.onPlayerPause);
                    }

                    // workaround some browser issues when player starts
                    this.on(this.player, 'play', this.onPlayerStart);

                    // unmute local audio during playback
                    if (this.getRecordType() === engine.AUDIO_VIDEO)
                    {
                        this.mediaElement.muted = false;

                        // show the volume bar when it's unmuted
                        this.displayVolumeControl(true);
                    }

                    // load recorded media
                    this.load(this.player.recordedData);
                }.bind(this));

                // pause player so user can start playback
                this.player.pause();
                break;

            case engine.ANIMATION:
                // animation data is ready
                this._processing = false;

                // hide loader
                this.player.loadingSpinner.hide();

                // show animation total duration
                this.setDuration(this.streamDuration);

                // hide preview video
                this.mediaElement.style.display = 'none';

                // show the first frame
                this.player.recordCanvas.show();

                // pause player so user can start playback
                this.player.pause();

                // show animation on play
                this.on(this.player, 'play', this.showAnimation);

                // hide animation on pause
                this.on(this.player, 'pause', this.hideAnimation);
                break;
        }
    }

    /**
     * Fired when the volume in the temporary audio element
     * for Chrome in audio+video mode is present.
     * @private
     */
    onVolumeChange() {
        let volume = this.player().volume();
        if (this.player().muted()) {
            // muted volume
            volume = 0;
        }

        if (this.extraAudio !== undefined) {
            this.extraAudio.volume = volume;
        }
    }

    /**
     * Invoked during recording and displays the remaining time.
     * @private
     */
    onCountDown() {
        if (!this.paused) {
            var now = new Date().getTime();
            var duration = this.maxLength;
            var currentTime = (now - (this.startTime + this.pausedTime)) / 1000;

            this.streamDuration = currentTime;

            if (currentTime >= duration) {
                // at the end
                currentTime = duration;

                // stop recording
                this.stop();
            }

            // update duration
            this.setDuration(duration);

            // update current time
            this.setCurrentTime(currentTime, duration);

            // notify listeners
            this.player.trigger('progressRecord');
        }
    }

    /**
     * Get the current time of the recorded stream during playback.
     *
     * Returns 0 if no recording is available (yet).
     */
    getCurrentTime() {
        let currentTime = isNaN(this.streamCurrentTime) ? 0 : this.streamCurrentTime;

        if (this.getRecordType() === engine.AUDIO_ONLY) {
            currentTime = this.surfer.getCurrentTime();
        }

        return currentTime;
    }

    /**
     * Updates the player's element displaying the current time.
     *
     * @private
     * @param {number} [currentTime=0] - Current position of the
     *    playhead (in seconds).
     * @param {number} [duration=0] - Duration in seconds.
     */
    setCurrentTime(currentTime, duration) {
        currentTime = isNaN(currentTime) ? 0 : currentTime;
        duration = isNaN(duration) ? 0 : duration;

        switch (this.getRecordType()) {
            case engine.AUDIO_ONLY:
                this.surfer.setCurrentTime(currentTime, duration);
                break;

            case engine.VIDEO_ONLY:
            case engine.AUDIO_VIDEO:
            case engine.ANIMATION:
                this.streamCurrentTime = Math.min(currentTime, duration);

                // update current time display component
                this.player.controlBar.currentTimeDisplay.formattedTime_ =
                   this.player.controlBar.currentTimeDisplay.contentEl().lastChild.textContent =
                       formatTime(this.streamCurrentTime, duration, this.msDisplayMax);
                break;
        }
    }

    /**
     * Get the length of the recorded stream in seconds.
     *
     * Returns 0 if no recording is available (yet).
     */
    getDuration() {
        let duration = isNaN(this.streamDuration) ? 0 : this.streamDuration;

        return duration;
    }

    /**
     * Updates the player's element displaying the duration time.
     *
     * @param {number} [duration=0] - Duration in seconds.
     * @private
     */
    setDuration(duration) {
        duration = isNaN(duration) ? 0 : duration;

        switch (this.getRecordType()) {
            case engine.AUDIO_ONLY:
                this.surfer.setDuration(duration);
                break;

            case engine.VIDEO_ONLY:
            case engine.AUDIO_VIDEO:
            case engine.ANIMATION:
                // update duration display component
                this.player.controlBar.durationDisplay.formattedTime_ =
                    this.player.controlBar.durationDisplay.contentEl().lastChild.textContent =
                        formatTime(duration, duration, this.msDisplayMax);
                break;
        }
    }

    /**
     * Start loading data.
     *
     * @param {(string|blob|file)} url - Either the URL of the media file,
     *     a Blob, a File object or MediaStream.
     */
    load(url) {
        switch (this.getRecordType()) {
            case engine.AUDIO_ONLY:
                // visualize recorded Blob stream
                this.surfer.load(url);
                break;

            case engine.IMAGE_ONLY:
            case engine.VIDEO_ONLY:
            case engine.AUDIO_VIDEO:
            case engine.ANIMATION:
                if (url instanceof Blob || url instanceof File) {
                    // assign using createObjectURL
                    setSrcObject(url, this.mediaElement, false);
                } else {
                    // assign stream without createObjectURL
                    setSrcObject(url, this.mediaElement, true);
                }
                break;
        }
    }

    /**
     * Show save as dialog in browser so the user can store the recorded media
     * locally.
     *
     * @private
     * @param {object} name - Object with one or more names for the particular
     *     blob(s) you want to save. File extensions are added automatically.
     *     For example: {'video': 'name-of-video-file'}. Supported keys are
     *     'audio', 'video' and 'gif'.
     */
    saveAs(name) {
        if (this.engine && name !== undefined) {
            this.engine.saveAs(name);
        }
    }

    /**
     * Destroy plugin and players and cleanup resources.
     */
    destroy() {
        // prevent callbacks if recording is in progress
        if (this.engine) {
            this.engine.dispose();
            this.engine.off('recordComplete', this.engineStopCallback);
        }

        // stop recording and device
        this.stop();
        this.stopDevice();

        // stop countdown
        this.player.clearInterval(this.countDown);

        // dispose player
        switch (this.getRecordType()) {
            case engine.AUDIO_ONLY:
                if (this.surfer) {
                    // also disposes player
                    this.surfer.destroy();
                }
                break;

            case engine.IMAGE_ONLY:
            case engine.VIDEO_ONLY:
            case engine.AUDIO_VIDEO:
            case engine.ANIMATION:
                this.player.dispose();
                break;
        }

        this.resetState();
    }

    /**
     * Reset the plugin.
     */
    reset() {
        // prevent callbacks if recording is in progress
        if (this.engine) {
            this.engine.dispose();
            this.engine.off('recordComplete', this.engineStopCallback);
        }

        // stop recording and device
        this.stop();
        this.stopDevice();

        // stop countdown
        this.player.clearInterval(this.countDown);

        // reset options
        this.loadOptions();

        // reset recorder state
        this.resetState();

        // reset record time
        this.setDuration(this.maxLength);
        this.setCurrentTime(0);

        // reset player
        this.player().reset();
        switch (this.getRecordType()) {
            case engine.AUDIO_ONLY:
                if (this.surfer && this.surfer.surfer) {
                    // empty last frame
                    this.surfer.surfer.empty();
                }
                break;

            case engine.IMAGE_ONLY:
            case engine.ANIMATION:
                // reset UI
                this.player().recordCanvas.hide();
                this.player().cameraButton.hide();
                break;
        }

        // hide play control
        this.player.controlBar.playToggle.hide();

        // show device selection button
        this.player.deviceButton.show();

        // hide record button
        this.player.recordToggle.hide();

        // loadedmetadata resets the durationDisplay for the
        // first time
        this.player.one('loadedmetadata', function() {
            // display max record time
            this.setDuration(this.maxLength);
        }.bind(this));
    }

    /**
     * Reset the plugin recorder state.
     * @private
     */
    resetState() {
        this._recording = false;
        this._processing = false;
        this._deviceActive = false;
        this.devices = [];
    }

    /**
     * Get recorder type.
     */
    getRecordType() {
        return getRecorderMode(this.recordImage, this.recordAudio,
            this.recordVideo, this.recordAnimation);
    }

    /**
     * Create and display snapshot image.
     * @private
     */
    createSnapshot() {
        this.captureFrame().then(function(result) {
            // turn the canvas data into base64 data with a PNG header
            this.player.recordedData = result.toDataURL('image/png');

            // hide preview video
            this.mediaElement.style.display = 'none';

            // show the snapshot
            this.player.recordCanvas.show();

            // stop recording
            this.stop();
        }.bind(this));
    }

    /**
     * Reset UI for retrying a snapshot image.
     * @private
     */
    retrySnapshot() {
        this._processing = false;

        // retry: hide the snapshot
        this.player.recordCanvas.hide();

        // show preview video
        this.player.el().firstChild.style.display = 'block';
    }

    /**
     * Capture frame from camera and copy data to canvas.
     * @private
     */
    captureFrame() {
        var here = this;
        var detected = detectBrowser();
        var recordCanvas = this.player.recordCanvas.el().firstChild;

        // set the canvas size to the dimensions of the camera,
        // which also wipes the content of the canvas
        recordCanvas.width = this.player.width();
        recordCanvas.height = this.player.height();

        return new Promise(function(resolve, reject) {
            // MediaCapture is only supported on:
            // - Chrome 60 and newer (see
            // https://github.com/w3c/mediacapture-image/blob/gh-pages/implementation-status.md)
            // - Firefox behind flag (https://bugzilla.mozilla.org/show_bug.cgi?id=888177)
            // importing ImageCapture can fail when enabling chrome
            // flag is still required. if so; ignore and continue
            if ((detected.browser === 'chrome' && detected.version >= 60) &&
               (typeof ImageCapture === typeof Function)) {
                try {
                    var track = here.stream.getVideoTracks()[0];
                    var imageCapture = new ImageCapture(track);

                    imageCapture.takePhoto().then(function(blob) {
                        return createImageBitmap(blob);
                    }
                    ).then(function(imageBitmap) {
                        // get a frame and copy it onto the canvas
                        here.drawCanvas(recordCanvas, imageBitmap);

                        // notify others
                        resolve(recordCanvas);
                    });
                    return;
                } catch(err) {}
            }

            // get a frame and copy it onto the canvas
            here.drawCanvas(recordCanvas, here.mediaElement);

            // notify others
            resolve(recordCanvas);
        });
    }

    /**
     * Draw image frame on canvas element.
     * @private
     */
    drawCanvas(canvas, element) {
        canvas.getContext('2d').drawImage(
            element, 0, 0,
            canvas.width,
            canvas.height
        );
    }

    /**
     * Start preview of video stream.
     * @private
     */
    startVideoPreview() {
        // disable playback events
        this.off('timeupdate');
        this.off('durationchange');
        this.off('loadedmetadata');
        this.off('play');

        // mute local audio
        this.mediaElement.muted = true;

        // hide volume control to prevent feedback
        this.displayVolumeControl(false);

        // start or resume live preview
        this.load(this.stream);
        this.mediaElement.play();
    }

    /**
     * Show animated GIF.
     * @private
     */
    showAnimation() {
        var animationDisplay = this.player.animationDisplay.el().firstChild;

        // set the image size to the dimensions of the recorded animation
        animationDisplay.width = this.player.width();
        animationDisplay.height = this.player.height();

        // hide the first frame
        this.player.recordCanvas.hide();

        // show the animation
        animationDisplay.src = this.player.recordedData;
        this.player.animationDisplay.show();
    }

    /**
     * Hide animated GIF.
     * @private
     */
    hideAnimation() {
        // show the first frame
        this.player.recordCanvas.show();

        // hide the animation
        this.player.animationDisplay.hide();
    }

    /**
     * Player started playback.
     * @private
     */
    onPlayerStart() {
        // workaround chrome issue
        if (this.getRecordType() === engine.AUDIO_VIDEO && isChrome() &&
            !this._recording && this.extraAudio !== undefined) {
            // sync extra audio playhead position with video.js player
            this.extraAudio.currentTime = this.player.currentTime();
            this.extraAudio.play();
        }
    }

    /**
     * Player is paused.
     * @private
     */
    onPlayerPause() {
        // pause extra audio when video.js player pauses
        if (this.extraAudio !== undefined) {
            this.extraAudio.pause();
        }
    }

    /**
     * Update time during playback.
     * @private
     */
    playbackTimeUpdate() {
        this.setCurrentTime(this.player.currentTime(),
            this.streamDuration);
    }

    /**
     * Received new timestamp (when timeSlice option is enabled).
     * @private
     */
    onTimeStamp(current, all) {
        this.player.currentTimestamp = current;
        this.player.allTimestamps = all;

        // get blob (only for MediaStreamRecorder)
        var internal;
        switch (this.getRecordType()) {
            case engine.AUDIO_ONLY:
                internal = this.engine.engine.audioRecorder;
                break;

            case engine.ANIMATION:
                internal = this.engine.engine.gifRecorder;
                break;

            default:
                internal = this.engine.engine.videoRecorder;
                break;
        }
        internal = internal.getInternalRecorder();
        if ((internal instanceof MediaStreamRecorder) === true) {
            this.player.recordedData = internal.getArrayOfBlobs();
        }

        // notify others
        this.player.trigger('timestamp');
    }

    /**
     * Collects information about the media input and output devices
     * available on the system.
     *
     * Returns an array.
     */
    enumerateDevices() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            this.player.enumerateErrorCode = 'enumerateDevices() not supported.';
            this.player.trigger('enumerateError');
            return;
        }

        // List cameras and microphones.
        let self = this;
        navigator.mediaDevices.enumerateDevices(this).then(function(devices) {
            self.devices = [];
            devices.forEach(function(device) {
                self.devices.push(device);
            });

            // notify listeners
            self.player.trigger('enumerateReady');
        }).catch(function(err) {
            self.player.enumerateErrorCode = err;
            self.player.trigger('enumerateError');
        });
    }

    /**
     * Show or hide the volume menu.
     *
     * @private
     * @param {boolean} display - Hide/show volume control.
     */
    displayVolumeControl(display) {
        if (this.player.controlBar.volumePanel !== undefined) {
            if (display === true) {
                display = 'flex';
            } else {
                display = 'none';
            }
            this.player.controlBar.volumePanel.el().style.display = display;
        }
    }

}

/**
 * Create a custom button.
 * @private
 * @param {string} className - Class name for the new button.
 * @param {string} label - Label for the new button.
 * @param {string} iconName - Icon for the new button.
 */
const createButton = function(className, label, iconName) {
    let props = {
        className: 'vjs-' + className + '-button vjs-control vjs-icon-' + iconName,
        innerHTML: '<span aria-hidden="true" class="vjs-icon-placeholder"></span>',
    };
    let attrs = {
        role: 'button',
        // let the screen reader user know that the text of the button may change
        'aria-live': 'polite',
        tabIndex: 0,
        title: label
    };
    return Component.prototype.createEl('button', props, attrs);
};

/**
 * Create HTML element for plugin.
 *
 * @private
 */
const createPlugin = function() {
    let props = {
        className: 'vjs-record'
    };
    let attrs = {
        tabIndex: 0
    };
    return Component.prototype.createEl('div', props, attrs);
};

/**
 * Initialize the plugin.
 *
 * @param {Object} [options] - Configuration for the plugin.
 * @private
 */
const recordPlugin = function(options) {
    let settings = videojs.mergeOptions(pluginDefaultOptions, options);
    let player = this;

    // create new plugin instance
    player.recorder = new Recorder(player, {
        'el': createPlugin(),
        'options': settings
    });
    player.addChild(player.recorder);

    // get icon based on type
    let deviceIcon = 'av-perm';
    switch (player.recorder.getRecordType()) {
        case engine.IMAGE_ONLY:
        case engine.VIDEO_ONLY:
        case engine.ANIMATION:
            deviceIcon = 'video-perm';
            break;
        case engine.AUDIO_ONLY:
            deviceIcon = 'audio-perm';
            break;
    }

    // add device button
    player.deviceButton = new DeviceButton(player, {
        'el': createButton('device', player.localize('Device'),
            deviceIcon)
    });
    player.addChild(player.deviceButton);

    // add record indicator
    player.recordIndicator = new RecordIndicator(player, {
        'el': Component.prototype.createEl('div', {
            className: 'vjs-record-indicator vjs-control'
        })
    });
    player.recordIndicator.hide();
    player.addChild(player.recordIndicator);

    // add canvas for recording and displaying image
    player.recordCanvas = new RecordCanvas(player, {
        'el': Component.prototype.createEl('div', {
            className: 'vjs-record-canvas',
            innerHTML: '<canvas></canvas>'
        })
    });
    player.recordCanvas.hide();
    player.addChild(player.recordCanvas);

    // add image for animation display
    player.animationDisplay = new AnimationDisplay(player, {
        'el': Component.prototype.createEl('div', {
            className: 'vjs-animation-display',
            innerHTML: '<img />'
        })
    });
    player.animationDisplay.hide();
    player.addChild(player.animationDisplay);

    // add camera button
    player.cameraButton = new CameraButton(player, {
        'el': createButton('camera', player.localize('Image'),
            'photo-camera')
    });
    player.cameraButton.hide();

    // add record toggle
    player.recordToggle = new RecordToggle(player, {
        'el': createButton('record', player.localize('Record'),
            'record-start')
    });
    player.recordToggle.hide();
};

// register plugin
videojs.Recorder = Recorder;

if (videojs.registerPlugin) {
    videojs.registerPlugin('record', recordPlugin);
} else {
    videojs.plugin('record', recordPlugin);
}

module.exports = {
    Recorder
};
