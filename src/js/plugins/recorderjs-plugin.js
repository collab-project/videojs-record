/**
 * @file recorderjs-plugin.js
 * @since 1.1.0
 */

import videojs from 'video.js';

const RecordEngine = videojs.getComponent('RecordEngine');

/**
 * Audio-only engine for the recorder.js library.
 *
 * @class
 * @augments RecordEngine
 */
class RecorderjsEngine extends RecordEngine {
    /**
     * Setup recording engine.
     *
     * @param {LocalMediaStream} stream - Media stream to record.
     * @param {Object} mediaType - Object describing the media type of this
     *     engine.
     * @param {Boolean} debug - Indicating whether or not debug messages should
     *     be printed in the console.
     */
    setup(stream, mediaType, debug) {
        this.inputStream = stream;
        this.mediaType = mediaType;
        this.debug = debug;

        let AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        this.audioSourceNode = this.audioContext.createMediaStreamSource(
            this.inputStream);

        // setup recorder.js
        this.engine = new Recorder(this.audioSourceNode, {
            bufferLen: this.bufferSize,
            numChannels: this.audioChannels
        });
    }

    /**
     * Start recording.
     */
    start() {
        this.engine.record();
    }

    /**
     * Stop recording.
     */
    stop() {
        this.engine.stop();

        if (this.engine.exportWAV !== undefined) {
            this.engine.exportWAV(this.onStopRecording.bind(this));
        }
        if (this.engine.clear !== undefined) {
            this.engine.clear();
        }
    }
}

// expose plugin
videojs.RecorderjsEngine = RecorderjsEngine;

export default RecorderjsEngine;
