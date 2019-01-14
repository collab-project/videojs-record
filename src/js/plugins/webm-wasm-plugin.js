/**
 * @file webm-wasm-plugin.js
 * @since 3.4.0
 */

const RecordRTCEngine = videojs.getComponent('RecordRTCEngine');

/**
 * Video engine plugin for the webm-wasm library.
 *
 * @class
 * @augments videojs.RecordRTCEngine
 */
class WebmWasmEngine extends RecordRTCEngine {
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
        super.setup(stream, mediaType, debug);

        this.engine.recorderType = WebAssemblyRecorder;
        // workerPath: '../libs/webm-worker.js',
        // webAssemblyPath: '../libs/webm-wasm.wasm',
    }

    /**
     * Start recording.
     */
    start() {
    }

    /**
     * Stop recording.
     */
    stop() {
    }
}

// expose plugin
videojs.WebmWasmEngine = WebmWasmEngine;

export default WebmWasmEngine;
