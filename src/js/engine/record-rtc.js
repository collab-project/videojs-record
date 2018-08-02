/**
 * @file record-rtc.js
 * @since 2.0.0
 */

import { RecordEngine } from './record-engine';
import { isChrome } from '../utils/detect-browser';
import {IMAGE_ONLY, AUDIO_ONLY, VIDEO_ONLY, AUDIO_VIDEO, ANIMATION} from './record-mode';

const Component = videojs.getComponent('Component');

/**
 * Engine used with the MRecordRTC class in the RecordRTC library.
 *
 * @class
 * @augments videojs.RecordEngine
 */
class RecordRTCEngine extends RecordEngine {

    /**
     * Setup recording engine.
     */
    setup(stream, mediaType, debug) {
        this.inputStream = stream;
        this.mediaType = mediaType;
        this.debug = debug;

        // setup RecordRTC
        this.engine = new RecordRTC.MRecordRTC();
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
     * Remove any temporary data and references to streams.
     */
    dispose() {
        super.dispose();

        if (typeof this.engine.destroy === 'function') {
            this.engine.destroy();
        }
    }

    /**
     * Start recording.
     */
    start() {
        this.engine.startRecording();
    }

    /**
     * Stop recording. Result will be available async when onStopRecording
     * is called.
     */
    stop() {
        this.engine.stopRecording(this.onStopRecording.bind(this));
    }

    /**
     * Pause recording.
     */
    pause() {
        this.engine.pauseRecording();
    }

    /**
     * Resume recording.
     */
    resume() {
        this.engine.resumeRecording();
    }

    /**
     * Show save as dialog in browser so the user can store the recorded media
     * locally.
     *
     * @param {object} name - Object with names for the particular blob(s)
     *     you want to save. File extensions are added automatically. For
     *     example: {'video': 'name-of-video-file'}. Supported keys are
     *     'audio', 'video' and 'gif'.
     */
    saveAs(name) {
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
        let recordType = this.player().record().getRecordType();
        this.engine.getBlob((recording) => {
            switch (recordType) {
                case AUDIO_ONLY:
                    if (recording.audio !== undefined) {
                        this.recordedData = recording.audio;
                    }
                    break;

                case VIDEO_ONLY:
                case AUDIO_VIDEO:
                    // recordrtc returns a single blob that includes both audio
                    // and video data
                    if (recording.video !== undefined) {
                        this.recordedData = recording.video;
                    }
                    break;

                case ANIMATION:
                    if (recording.gif !== undefined) {
                        this.recordedData = recording.gif;
                    }
                    break;
            }
            // inject file info
            this.addFileInfo(this.recordedData);

            // notify listeners
            this.trigger('recordComplete');

        });
    }
}

// expose plugin
videojs.RecordRTCEngine = RecordRTCEngine;

Component.registerComponent('RecordRTCEngine', RecordRTCEngine);

export default RecordRTCEngine;
