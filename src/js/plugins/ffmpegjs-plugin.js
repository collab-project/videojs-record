/**
 * @file ffmpegjs-plugin.js
 * @since 3.8.0
 */

import videojs from 'video.js';

const ConvertEngine = videojs.getComponent('ConvertEngine');

/**
 * Converter engine using the ffmpeg.js library.
 *
 * @class
 * @augments videojs.ConvertEngine
 */
class FFmpegjsEngine extends ConvertEngine {
    /**
     * Setup recording engine.
     *
     * @param {Object} mediaType - Object describing the media type of this
     *     engine.
     * @param {Boolean} debug - Indicating whether or not debug messages should
     *     be printed in the console.
     */
    setup(mediaType, debug) {
        this.mediaType = mediaType;
        this.debug = debug;

        this.stdout = this.stderr = '';
        this.engine = new Worker(this.convertWorkerURL);
        this.engine.onmessage = this.onWorkerMessage.bind(this);
    }

    /**
     * Invoked when recording is stopped and resulting stream is available.
     *
     * @param {blob} data - Reference to the recorded `Blob`.
     */
    convert(data) {
        // save timestamp
        this.timestamp = new Date();
        this.timestamp.setTime(data.lastModified);

        // load and convert blob
        this.loadBlob(data).then((buffer) => {
            let opts = ['-i', data.name].concat(this.convertOptions);
            // XXX: ability to specify name
            opts.push('output.mp3');

            // start conversion
            this.engine.postMessage({
                type: 'run',
                MEMFS: [{name: data.name, data: buffer}],
                // TOTAL_MEMORY: 256 * 1024 * 1024,
                arguments: opts
            });
        });
    }

    /**
     * Received a message from the worker.
     *
     * @param {Object} event - TODO
     * @private
     */
    onWorkerMessage(event) {
        let msg = event.data;
        switch (msg.type) {
            // worker loaded and ready to accept commands
            case 'ready':
                break;

            // worker started job
            case 'run':
                // notify listeners
                this.player().trigger('startConvert');
                break;

            // job finished with some result
            case 'done':
                let buf = msg.data.MEMFS[0].data;

                // XXX: ability to specify mime-type
                let result = new Blob(buf, {type: 'audio/mp3'});

                // inject date and name into blob
                this.addFileInfo(result, this.timestamp);

                // store result
                this.player().convertedData = result;

                // notify listeners
                this.player().trigger('finishConvert');
                break;

            // FFmpeg printed to stdout
            case 'stdout':
                this.stdout += msg.data + '\n';
                break;

            // FFmpeg printed to stderr
            case 'stderr':
                this.stderr += msg.data + "\n";
                break;

            // FFmpeg exited
            case 'exit':
                break;

            // error occured
            case 'error':
                this.player().trigger('error', msg.data);
                break;
        }
    }
}

// expose plugin
videojs.FFmpegjsEngine = FFmpegjsEngine;

export default FFmpegjsEngine;
