/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
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
        this.coreURL = '/node_modules/@ffmpeg/core-mt/dist/umd/ffmpeg-core.js';
        /**
         * Path to script `ffmpeg-core.worker.js`.
         *
         * @type {string}
         */
        this.convertWorkerURL = '/node_modules/@ffmpeg/core-mt/dist/umd/ffmpeg-core.worker.js';
        /**
         * Path to script `ffmpeg-core.wasm`.
         *
         * @type {string}
         */
        this.audioWebAssemblyURL = '/node_modules/@ffmpeg/core-mt/dist/umd/ffmpeg-core.wasm';
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

        this.ffmpeg = null;
    }

    /**
     * Inject metadata.
     *
     * @param {Blob} data - Recorded data that needs to be converted.
     */
    async convert(data) {
        // set output mime type
        if (this.pluginLibraryOptions.outputType === undefined) {
            throw new Error('no outputType specified!');
        }
        this.outputType = this.pluginLibraryOptions.outputType;

        // setup ffmpeg.wasm
        const {fetchFile} = FFmpegUtil;
        const {FFmpeg} = FFmpegWASM;
        if (this.ffmpeg === null) {
            this.ffmpeg = new FFmpeg();

            if (this.debug) {
                this.ffmpeg.on('log', ({message}) => {
                    console.log(message);
                });
            }

            await this.ffmpeg.load({
                coreURL: this.coreURL,
                wasmURL: this.audioWebAssemblyURL,
                workerURL: this.convertWorkerURL,
            });
        }

        // save timestamp
        const timestamp = new Date();
        timestamp.setTime(data.lastModified);

        // use temporary filenames
        const tempInputName = 'input_' + timestamp.getTime();
        const tempOutputName = 'output_' + timestamp.getTime();

        // add ffmpeg options
        let opts = ['-i', tempInputName];
        opts = opts.concat(this.convertOptions);
        opts.push(tempOutputName);

        // notify listeners
        this.player().trigger('startConvert');

        // load and convert blob
        await this.ffmpeg.writeFile(tempInputName, await fetchFile(data));
        console.log(opts);
        await this.ffmpeg.exec(opts);
        const output = await this.ffmpeg.readFile(tempOutputName);

        // create new blob
        let result = new Blob([output.buffer], {type: this.outputType});

        // add existing file info
        this.addFileInfo(result, timestamp);

        // store result
        this.player().convertedData = result;

        // notify listeners
        this.player().trigger('finishConvert');
    }

    /**
     * Terminate the FFMPEG workers if they have been started
     */
    dispose() {
        super.dispose();
        if (this.ffmpeg !== null && this.ffmpeg.loaded) {
            this.ffmpeg.terminate();
            this.ffmpeg = null;
        }
    }
}

// expose plugin
videojs.FFmpegWasmEngine = FFmpegWasmEngine;

export default FFmpegWasmEngine;
