/*! videojs-record
 * Copyright (c) 2014-2015 Collab
 * Licensed under the MIT license. */
(function(window, videojs) {
    'use strict';

    /**
     * Record audio/video with the video.js player.
     */
    videojs.Recorder = videojs.Component.extend({

        AUDIO_ONLY: 'audio_only',
        VIDEO_ONLY: 'video_only',
        AUDIO_VIDEO: 'audio_video',

        /**
         * The constructor function for the class.
         * 
         * @param {videojs.Player|Object} player
         * @param {Object} options Player options.
         * @param {Function} ready Ready callback function.
         */
        init: function(player, options, ready)
        {
            // run base component initializing with new options.
            videojs.Component.call(this, player, options, ready);

            // parse settings
            this.recordAudio = this.options().options.audio;
            this.recordVideo = this.options().options.video;
            this.recordTimeMax = this.options().options.recordTimeMax;

            this._recording = false;

            // cross-browser
            this.getUserMedia = (
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia
            ).bind(navigator);

            switch (this.getRecordType())
            {
                case this.AUDIO_ONLY:
                    // XXX: enable videojs-wavesurfer plugin automatically?
                    this.surfer = player.waveform;
                    break;

                case this.VIDEO_ONLY:
                    // customize controls
                    // XXX: below are hacks copied from videojs.wavesurfer that
                    //      customize the video.js UI...
                    this.player().bigPlayButton.hide();
                    if (this.player().options().controls)
                    {
                        // progress control isn't used by this plugin
                        this.player().controlBar.progressControl.hide();

                        // prevent controlbar fadeout
                        this.player().on('userinactive', function(event)
                        {
                           this.player().userActive(true);
                        });

                        // videojs automatically hides the controls when no valid 'source'
                        // element is included in the 'audio' tag. Don't.
                        this.player().controlBar.show();

                        // disable currentTimeDisplay's 'timeupdate' event listener that
                        // constantly tries to reset the current time value to 0
                        this.player().off('timeupdate');
                    }
                    break;
            }

            // display max record time
            this.setDuration(this.recordTimeMax);

            // hide play control
            this.player().controlBar.playToggle.hide();
        },

        /**
         * Indicates whether we're currently recording or not.
         */
        isRecording: function()
        {
            return this._recording;
        },

        /**
         * Open the brower's recording device selection dialog.
         */
        getDevice: function()
        {
            // setup device
            switch (this.getRecordType())
            {
                case this.AUDIO_ONLY:
                    // setup microphone
                    this.surfer.microphone.on('deviceReady',
                        this.onDeviceReady.bind(this));
                    this.surfer.microphone.on('deviceError',
                        this.onDeviceError.bind(this));

                    // open browser device selection dialog
                    this.player().play();
                    break;

                case this.VIDEO_ONLY:
                    // setup camera
                    this.getUserMedia({
                        video: true,
                        audio: false
                    },
                    this.onDeviceReady.bind(this),
                    this.onDeviceError.bind(this));
                    break;

                case this.AUDIO_VIDEO:
                    // setup camera/mic
                    this.getUserMedia({
                        video: true,
                        audio: true
                    },
                    this.onDeviceReady.bind(this),
                    this.onDeviceError.bind(this));
                    break;
            }
        },

        /**
         * Invoked when the device is ready.
         *
         * @param stream:
         */
        onDeviceReady: function(stream)
        {
            this.stream = stream;

            // connect stream to recording engine
            this.engine = RecordRTC(this.stream);

            // hide device selection button
            this.player().deviceButton.hide();

            // show record button
            this.player().recordToggle.show();

            // tweak default videojs UI
            this.player().controlBar.liveDisplay.hide();
            this.player().controlBar.currentTimeDisplay.show();
            this.player().controlBar.timeDivider.show();
            this.player().controlBar.durationDisplay.show();

            // setup preview
            switch (this.getRecordType())
            {
                case this.VIDEO_ONLY:
                    // show live video preview
                    this.mediaElement = this.player().el().firstChild;
                    this.mediaElement.src = URL.createObjectURL(this.stream);
                    this.mediaElement.muted = true;
                    this.mediaElement.controls = false;
                    this.mediaElement.play();
                    break;
            }
        },

        /**
         * Invoked when an device error occurred.
         */
        onDeviceError: function(code)
        {
            // store code
            this.player().deviceErrorCode = code;

            // forward error to player
            this.player().trigger('deviceError');
        },

        /**
         * Start recording.
         */
        start: function()
        {
            this._recording = true;

            // hide play control
            this.player().controlBar.playToggle.hide();

            // setup engine
            switch (this.getRecordType())
            {
                case this.AUDIO_ONLY:
                    // disable playback events
                    this.surfer.setupPlaybackEvents(false);

                    // start/resume live visualization
                    this.surfer.liveMode = true;
                    this.player().play();
                    break;
            }

            // start countdown
            this.startTime = this.stream.currentTime;
            this.countDown = this.setInterval(this.onCountDown.bind(this), 100);

            // start recording stream
            this.engine.startRecording();

            // notify UI
            this.trigger('startRecord');
        },

        /**
         * Stop recording.
         */
        stop: function()
        {
            this._recording = false;

            // stop countdown
            this.clearInterval(this.countDown);

            // stop recording stream
            this.engine.stopRecording(this.onStopRecording.bind(this));

            // notify UI
            this.trigger('stopRecord');
        },

        /**
         * Invoked when recording is stopped and resulting stream is available.
         *
         * @param {string} audioVideoWebMURL Reference to the recorded Blob object, eg.
         *   blob:http://localhost:8080/10100016-4248-9949-b0d6-0bb40db56eba
         */
        onStopRecording: function(audioVideoWebMURL)
        {
            switch (this.getRecordType())
            {
                case this.AUDIO_ONLY:
                    // get stream data
                    var recordedBlob = this.engine.getBlob();

                    // Pausing the player so we can visualize the recorded data
                    // will trigger an async videojs 'pause' event that we have
                    // to wait for.
                    this.player().one('pause', function()
                    {
                        // show play control
                        // XXX: once the waveform's ready?
                        this.player().controlBar.playToggle.show();

                        // setup events during playback
                        this.surfer.setupPlaybackEvents(true);

                        // display loader
                        this.player().loadingSpinner.show();

                        // visualize recorded stream
                        this.surfer.load(recordedBlob);

                    }.bind(this));

                    // pause player's live visualization
                    this.player().pause();
                    break;

                case this.VIDEO_ONLY:
                    this.player().one('pause', function()
                    {
                        // show play control
                        this.player().controlBar.playToggle.show();

                        // hide loader
                        this.player().loadingSpinner.hide();

                        // show stream duration
                        this.setDuration(this.streamDuration);

                        // update time during playback
                        this.player().on('timeupdate', function()
                        {
                            this.setCurrentTime(this.player().currentTime(),
                                this.streamDuration);
                        }.bind(this));

                        // workaround firefox issue
                        this.player().on('play', function()
                        {
                            if (this.player().seeking())
                            {
                                // There seems to be a Firefox issue with playing back blobs.
                                // The ugly, but functional workaround, is to simply reset
                                // the source.
                                this.mediaElement.src = audioVideoWebMURL;
                                this.player().play();
                            }
                        }.bind(this));

                        // load recorded video
                        this.mediaElement.src = audioVideoWebMURL;

                    }.bind(this));

                    // pause player so user can start playback
                    this.player().pause();
                    break;
            }
        },

        /**
         * Invoked during recording and displays the remaining time.
         */
        onCountDown: function()
        {
            var currentTime = this.stream.currentTime - this.startTime;
            var duration = this.recordTimeMax;

            this.streamDuration = currentTime;

            if (currentTime >= duration)
            {
                // at the end
                currentTime = duration;

                // stop recording
                this.stop();
            }

            // update duration
            this.setDuration(duration);

            // update current time
            this.setCurrentTime(currentTime, duration);
        },

        /**
         * Updates the player's element displaying the current time.
         *
         * @param {Number} currentTime (optional) Current position of the
         *    playhead (in seconds).
         * @param {Number} duration (optional) Duration in seconds.
         */
        setCurrentTime: function(currentTime, duration)
        {
            switch (this.getRecordType())
            {
                case this.AUDIO_ONLY:
                    this.surfer.setCurrentTime(currentTime, duration);
                    break;

                default:
                    var time = Math.min(currentTime, duration);

                    // update control
                    this.player().controlBar.currentTimeDisplay.el(
                        ).firstChild.innerHTML = this.formatTime(
                        time, duration);
                    break;
            }
        },

        /**
         * Updates the player's element displaying the duration time.
         *
         * @param {Number} duration (optional) Duration in seconds.
         */
        setDuration: function(duration)
        {
            switch (this.getRecordType())
            {
                case this.AUDIO_ONLY:
                    this.surfer.setDuration(duration);
                    break;

                default:
                    // update control
                    this.player().controlBar.durationDisplay.el(
                        ).firstChild.innerHTML = this.formatTime(
                        duration, duration);
                    break;
            }
        },

        /**
         * Get recorder type.
         */
        getRecordType: function()
        {
            if (this.recordAudio && !this.recordVideo)
            {
                return this.AUDIO_ONLY;
            }
            else if (this.recordAudio && this.recordVideo)
            {
                return this.AUDIO_VIDEO;
            }
            else if (!this.recordAudio && this.recordVideo)
            {
                return this.VIDEO_ONLY;
            }
        },

        /**
         * Format seconds as a time string, H:MM:SS, M:SS or M:SS:MMM.
         * 
         * Supplying a guide (in seconds) will force a number of leading zeros
         * to cover the length of the guide.
         * 
         * @param {Number} seconds Number of seconds to be turned into a string
         * @param {Number} guide Number (in seconds) to model the string after
         * @return {String} Time formatted as H:MM:SS, M:SS or M:SS:MMM.
         */
        formatTime: function(seconds, guide)
        {
            // Default to using seconds as guide
            guide = guide || seconds;
            var s = Math.floor(seconds % 60),
                m = Math.floor(seconds / 60 % 60),
                h = Math.floor(seconds / 3600),
                gm = Math.floor(guide / 60 % 60),
                gh = Math.floor(guide / 3600),
                ms = Math.floor((seconds - s) * 1000);

            // handle invalid times
            if (isNaN(seconds) || seconds === Infinity)
            {
                // '-' is false for all relational operators (e.g. <, >=) so this
                // setting will add the minimum number of fields specified by the
                // guide
                h = m = s = ms = '-';
            }

            // Check if we need to show milliseconds
            if (guide > 0 && guide < this.msDisplayMax)
            {
                if (ms < 100)
                {
                    if (ms < 10)
                    {
                        ms = '00' + ms;
                    }
                    else
                    {
                        ms = '0' + ms;
                    }
                }
                ms = ":" + ms;
            }
            else
            {
                ms = '';
            }

            // Check if we need to show hours
            h = (h > 0 || gh > 0) ? h + ':' : '';

            // If hours are showing, we may need to add a leading zero.
            // Always show at least one digit of minutes.
            m = (((h || gm >= 10) && m < 10) ? '0' + m : m) + ':';

            // Check if leading zero is need for seconds
            s = ((s < 10) ? '0' + s : s);

            return h + m + s + ms;
        }

    });

    var RecordToggle, DeviceButton;

    /**
     * Button to toggle between start and stop recording
     * @param {videojs.Player|Object} player
     * @param {Object=} options
     * @class
     * @constructor
    */
    RecordToggle = videojs.Button.extend(
    {
        /** @constructor */
        init: function(player, options)
        {
            videojs.Button.call(this, player, options);

            this.on('click', this.onClick);
            this.on(player, 'startRecord', this.onStart);
            this.on(player, 'stopRecord', this.onStop);
        }
    });

    RecordToggle.prototype.onClick = function(e)
    {
        // stop this event before it bubbles up
        e.stopImmediatePropagation();

        var recorder = this.player().recorder;

        if (!recorder.isRecording())
        {
            recorder.start();
        }
        else
        {
            recorder.stop();
        }
    };

    RecordToggle.prototype.onStart = function()
    {
        // add the vjs-record-start class to the element so it can change appearance
        this.removeClass('vjs-record-stop');
        this.addClass('vjs-record-start');

        // update label
        this.el().firstChild.firstChild.innerHTML = this.localize('Stop');
    };

    RecordToggle.prototype.onStop = function()
    {
        // add the vjs-record-stop class to the element so it can change appearance
        this.removeClass('vjs-record-start');
        this.addClass('vjs-record-stop');

        // update label
        this.el().firstChild.firstChild.innerHTML = this.localize('Record');
    };

    /**
     * Button to select recording device
     * @param {videojs.Player|Object} player
     * @param {Object=} options
     * @class
     * @constructor
    */
    DeviceButton = videojs.Button.extend(
    {
        /** @constructor */
        init: function(player, options)
        {
            videojs.Button.call(this, player, options);

            this.on('click', this.onClick);
        }
    });
    DeviceButton.prototype.onClick = function(e)
    {
        // stop this event before it bubbles up
        e.stopImmediatePropagation();

        // open device dialog
        this.player().recorder.getDevice();
    };

    // Note that we're not doing this in prototype.createEl() because
    // it won't be called by Component.init (due to name obfuscation).
    /**
     * Create a custom button
     * @param className {string} class name for the new button
     * @param label {string} label for the new button
     */
    var createButton = function(className, label)
    {
        var props = {
            className: 'vjs-' + className + '-button vjs-control',
            innerHTML: '<div class="vjs-control-content"><span class="vjs-control-text">' +
                label + '</span></div>',
            role: 'button',
            'aria-live': 'polite', // let the screen reader user know that the text of the button may change
            tabIndex: 0
        };
        return videojs.Component.prototype.createEl(null, props);
    };

    var createPlugin = function()
    {
        var props = {
            className: 'vjs-record',
            tabIndex: 0
        };
        return videojs.Component.prototype.createEl(null, props);
    };

    // plugin defaults
    var defaults = {
        audio: false,
        video: true,
        recordTimeMax: 10
    };

    /**
     * Initialize the plugin.
     * @param options (optional) {object} configuration for the plugin
     */
    var record = function(options)
    {
        var settings = videojs.util.mergeOptions(defaults, options);
        var player = this;

        // create recorder
        player.recorder = new videojs.Recorder(player,
        {
            'el': createPlugin(),
            'options': settings
        });
        player.el().appendChild(player.recorder.el());

        // add device button
        player.deviceButton = new DeviceButton(player,
        {
            'el': createButton('device', player.localize('Device')),
        });
        player.recorder.el().appendChild(player.deviceButton.el());

        // add record toggle
        player.recordToggle = new RecordToggle(player,
        {
            'el': createButton('record', player.localize('Record')),
        });
        player.recordToggle.hide();
        player.controlBar.el().insertBefore(player.recordToggle.el(),
            player.controlBar.el().firstChild);
    };

    // register the plugin
    videojs.plugin('record', record);

})(window, window.videojs);
