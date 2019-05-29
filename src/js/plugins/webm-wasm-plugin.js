/**
 * @file webm-wasm-plugin.js
 * @since 3.5.0
 */

import videojs from 'video.js';
import RecordRTC from 'recordrtc';

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
        // set options
        this.recorderType = RecordRTC.WebAssemblyRecorder;
        this.workerPath = this.videoWorkerURL;

        super.setup(stream, mediaType, debug);
    }
}

// expose plugin
videojs.WebmWasmEngine = WebmWasmEngine;

export default WebmWasmEngine;
