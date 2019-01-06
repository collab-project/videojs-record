/* eslint-disable no-console */
/**
 * @file ffmpegjs-plugin.js
 * @since x.x.x
 */

const RecordEngine = videojs.getComponent('RecordEngine');

/**
 * Converter engine using the ffmpeg.js library.
 *
 * @class
 * @augments videojs.RecordEngine
 */
class FFmpegjsEngine extends RecordEngine {

    /**
     * Setup recording engine.
     *
     * @param {Object} mediaType - Object describing the media type of this
     *     engine.
     * @param {Boolean} debug - Indicating whether or not debug messages should
     *     be printed in the console.
     */
    setup(mediaType, debug) {
        console.log('FFmpegjsEngine.setup');

        this.mediaType = mediaType;
        this.debug = debug;

        this.stdout = this.stderr = '';
        this.engine = new Worker(this.convertWorkerURL);
        this.engine.onmessage = this.onWorkerMessage.bind(this);
    }

    /**
     * Invoked when recording is stopped and resulting stream is available.
     *
     * @param {blob} data - Reference to the recorded Blob.
     */
    recordComplete(data) {
        console.log('FFmpegjsEngine.recordComplete - input:', data);

        // convert blob to array buffer
        let fileReader = new FileReader();
        fileReader.onload = (event) => {
            let opts = ['-i', data.name].concat(this.convertOptions);
            // XXX: ability to specify name
            opts.push('output.mp3');
            console.log(opts);
            // start conversion
            if (this.debug) {
                console.log('Starting FFmpeg.js conversion...');
            }
            this.engine.postMessage({
                type: 'run',
                MEMFS: [{name: data.name, data: event.target.result}],
                // TOTAL_MEMORY: 256 * 1024 * 1024,
                arguments: opts
            });
        };
        fileReader.readAsArrayBuffer(data);
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
                if (this.debug) {
                    console.log('FFmpeg.js engine ready.');
                }
                break;

            // worker started job
            case 'run':
                if (this.debug) {
                    console.log('FFmpeg.js worker started job');
                }
                break;

            // job finished with some result
            case 'done':
                let buf = msg.data.MEMFS[0].data;

                // XXX: ability to specify type
                let result = new Blob(buf, {type: 'audio/mp3'});

                // inject date and name into blob
                this.addFileInfo(result);

                if (this.debug) {
                    console.log('FFmpeg.js worker finished job with result:', result);
                }

                // XXX: notify others
                this.saveAs({'audio': result.name}, result);
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
                if (this.debug) {
                    console.log('FFmpeg.js process exited with code ' + msg.data);
                    console.log(this.stdout);
                }
                // this.engine.terminate();
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
