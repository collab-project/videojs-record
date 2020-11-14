/**
 * @file ffmpeg-wasm-plugin.js
 * @since 4.2.0
 */

import videojs from 'video.js';

const ConvertEngine = videojs.getComponent('ConvertEngine');

/**
 * Converter engine using the ffmpeg.wasm library.
 *
 * @class
 * @augments videojs.ConvertEngine
 */
class FFmpegWasmEngine extends ConvertEngine {
    /**
     * Creates an instance of this class.
     *
     * @param  {Player} player
     *         The `Player` that this class should be attached to.
     *
     * @param  {Object} [options]
     *         The key/value store of player options.
     */
    constructor(player, options) {
        super(player, options);

        /**
         * Enables console logging for debugging purposes.
         *
         * @type {boolean}
         */
        this.debug = false;
        /**
         * Path to script `ffmpeg-core.js`.
         *
         * @type {string}
         */
        this.convertWorkerURL = './node_modules/@ffmpeg/core/dist/ffmpeg-core.js';
        /**
         * Mime-type for output.
         *
         * @type {string}
         */
        this.outputType = null;
        /**
         * Additional configuration options for the ffmpeg.wasm library.
         *
         * @type {object}
         */
        this.pluginLibraryOptions = {};
    }

    /**
     * Inject metadata.
     *
     * @param {Blob} data - Recorded data that needs to be converted.
     */
    async convert(data) {
        const { createFFmpeg, fetchFile } = FFmpeg;
        const ffmpeg = createFFmpeg({
            corePath: this.convertWorkerURL,
            log: this.debug
        });
        const name = "foo";

        // save timestamp
        const timestamp = new Date();
        timestamp.setTime(data.lastModified);

        // notify listeners
        this.player().trigger('startConvert');

        // load and convert blob
        await ffmpeg.load();
        ffmpeg.FS('writeFile', name, await fetchFile(data));
        await ffmpeg.run('-i', name,  'output.mp4');
        const output = ffmpeg.FS('readFile', 'output.mp4');

        // create new blob
        let result = new Blob([output.buffer], { type: 'video/mp4' })

        // add existing file info
        this.addFileInfo(result, timestamp);

        // store result
        this.player().convertedData = result;

        // notify listeners
        this.player().trigger('finishConvert');
    }
}

// expose plugin
videojs.FFmpegWasmEngine = FFmpegWasmEngine;

export default FFmpegWasmEngine;
