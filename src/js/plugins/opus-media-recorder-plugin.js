/**
 * @file opus-media-recorder-plugin.js
 * @since 4.2.0
 */

import OpusMediaRecorder from 'opus-media-recorder';

const RecordEngine = videojs.getComponent('RecordEngine');

/**
 * Audio-only engine for the opus-media-recorder library.
 *
 * opus-media-recorder uses WebAssembly compiled from popular
 * libraries (e.g libopus, libogg, libwebm, and speexdsp) to
 * ensure good performance and standards-compliance.
 *
 * @class
 * @augments RecordEngine
 */
class OpusMediaRecorderEngine extends RecordEngine {
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

        const workerOptions = this.audioWebAssemblyURL;
        workerOptions.encoderWorkerFactory = () => {
            return new Worker(this.audioWorkerURL);
        };

        // Existing MediaRecorder is replaced
        //window.MediaRecorder = OpusMediaRecorder;

        this.engine = new OpusMediaRecorder(this.inputStream, {}, workerOptions);
    }

    /**
     * Start recording.
     */
    start() {
        this.engine.start(this.audioSourceNode).then(() => {
            // recording started ok
        }).catch((err) => {
            // can't start playback
            this.player().trigger('error', err);
        });
    }

    /**
     * Stop recording.
     */
    stop() {
        this.engine.stop();
    }

    /**
     * Pause recording.
     */
    pause() {
        this.engine.pause();
    }

    /**
     * Resume recording.
     */
    resume() {
        this.engine.resume();
    }

    /**
     * @private
     * @param {Object} data - Audio data returned by opus-recorder.
     */
    onRecordingAvailable(data) {
        // Opus format stored in an Ogg container
        let blob = new Blob([data], {type: this.audioType});

        this.onStopRecording(blob);
    }
}

// expose plugin
videojs.OpusMediaRecorderEngine = OpusMediaRecorderEngine;

export default OpusMediaRecorderEngine;
