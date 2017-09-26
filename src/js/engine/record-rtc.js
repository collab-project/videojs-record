/**
 * @file record-rtc.js
 */

import * as base from './record-base';
import { isChrome } from '../utils/detect-browser';

/**
 * Engine used with the MRecordRTC class in the RecordRTC library.
 *
 * @private
 * @class
 * @augments RecordBase
 */
class RecordRTCEngine extends base.RecordBase {
    /**
     * The constructor function for the class.
     *
     * @private
     * @param {(videojs.Player|Object)} player - Video.js player instance.
     * @param {Object} options - Player options.
     */
    constructor(player, options) {
        super(player, options);
    }

    /**
     * Setup recording engine.
     * @private
     */
    setup(stream, mediaType, debug) {
        this.inputStream = stream;
        this.mediaType = mediaType;
        this.debug = debug;

        // setup RecordRTC
        this.engine = new MRecordRTC();
        this.engine.mediaType = this.mediaType;
        this.engine.disableLogs = !this.debug;
        this.engine.mimeType = this.mimeType;

        // audio settings
        this.engine.bufferSize = this.bufferSize;
        this.engine.sampleRate = this.sampleRate;
        this.engine.numberOfAudioChannels = this.audioChannels;

        // video/canvas settings
        this.engine.video = this.video;
        this.engine.canvas = this.canvas;

        // animated gif settings
        this.engine.quality = this.quality;
        this.engine.frameRate = this.frameRate;
        if (this.onTimeStamp !== undefined) {
            this.engine.timeSlice = this.timeSlice;
            this.engine.onTimeStamp = this.onTimeStamp;
        }

        // connect stream to recording engine
        this.engine.addStream(this.inputStream);
    }

    /**
     * Start recording.
     * @private
     */
    start()
    {
        this.engine.startRecording();
    }

    /**
     * Stop recording. Result will be available async when onStopRecording
     * is called.
     * @private
     */
    stop()
    {
        this.engine.stopRecording(this.onStopRecording.bind(this));
    }

    /**
     * Pause recording.
     * @private
     */
    pause()
    {
        this.engine.pauseRecording();
    }

    /**
     * Resume recording.
     * @private
     */
    resume()
    {
        this.engine.resumeRecording();
    }

    /**
     * Show save as dialog in browser so the user can store the recorded media
     * locally.
     *
     * @private
     * @param {object} name - Object with names for the particular blob(s)
     *     you want to save. File extensions are added automatically. For
     *     example: {'video': 'name-of-video-file'}. Supported keys are
     *     'audio', 'video' and 'gif'.
     */
    saveAs(name)
    {
        if (this.engine && name !== undefined) {
            this.engine.save(name);
        }
    }

    /**
     * Invoked when recording is stopped and resulting stream is available.
     *
     * @private
     * @param {string} audioVideoURL - Reference to the recorded Blob
     *     object, e.g. 'blob:http://localhost:8080/10100016-4248-9949-b0d6-0bb40db56eba'
     * @param {string} type - Media type, eg. 'video' or 'audio'.
     */
    onStopRecording(audioVideoURL, type) {
        // store reference to recorded stream URL
        this.mediaURL = audioVideoURL;

        // store reference to recorded stream data
        let recordType = this.player_.recorder.getRecordType();
        this.engine.getBlob(function(recording) {
            switch (recordType) {
                case base.AUDIO_ONLY:
                    this.recordedData = recording.audio;

                    this.addFileInfo(this.recordedData);

                    // notify listeners
                    this.trigger('recordComplete');
                    break;

                case base.VIDEO_ONLY:
                case base.AUDIO_VIDEO:
                    // when recording both audio and video, recordrtc
                    // calls this twice on chrome, first with audio data
                    // and then with video data.
                    // on firefox it's called once but with a single
                    // blob that includes both audio and video data.
                    if (recording.video !== undefined) {
                        // data is video-only but on firefox audio+video
                        this.recordedData = recording.video;

                        // on the chrome browser two blobs are created
                        // containing the separate audio/video streams.
                        if (recordType === base.AUDIO_VIDEO && isChrome()) {
                            // store both audio and video
                            this.recordedData = recording;

                            for (let mtype in this.recordedData) {
                                this.addFileInfo(this.recordedData[mtype]);
                            }
                        } else {
                            this.addFileInfo(this.recordedData);
                        }

                        // notify listeners
                        this.trigger('recordComplete');
                    }
                    break;

                case base.ANIMATION:
                    this.recordedData = recording.gif;

                    this.addFileInfo(this.recordedData);

                    // notify listeners
                    this.trigger('recordComplete');
                    break;
            }
        }.bind(this));
    }
}

export default RecordRTCEngine;
