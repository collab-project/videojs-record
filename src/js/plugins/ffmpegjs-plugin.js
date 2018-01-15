/**
 * @file ffmpegjs-plugin.js
 * @since 2.1.0
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
     */
    setup(mediaType, debug) {
        console.log('FFmpegjsEngine.setup');

        this.mediaType = mediaType;
        this.debug = debug;

        this.stdout = "";
        this.stderr = "";
        this.engine = new Worker(this.convertWorkerURL);
        this.engine.onmessage = this.onWorkerMessage.bind(this);
    }

    /**
     * Invoked when recording is stopped and resulting stream is available.
     *
     * @param {blob} data - Reference to the recorded Blob.
     */
    recordComplete(data) {
        console.log('FFmpegjsEngine.recordComplete', data);

        // convert to array buffer
        var arrayBuffer;
        var fileReader = new FileReader();
        fileReader.onload = (event) => {
            arrayBuffer = event.target.result;

            // start conversion
            console.log('Starting FFmpeg.js conversion...');
            this.engine.postMessage({
                type: "run",
                MEMFS: [{name: data.name, data: arrayBuffer}],
                // TOTAL_MEMORY: 256 * 1024 * 1024,
                arguments: ["-i", data.name, "-codec:a", "libmp3lame", "-qscale:a", "2", "output.mp3"]
            });
        };
        fileReader.readAsArrayBuffer(data);
    }

    /**
     * Received a message from the worker.
     */
    onWorkerMessage(event) {
        var msg = event.data;
        switch (msg.type) {
            // worker loaded and ready to accept commands
            case "ready":
                if (this.debug) {
                    console.log("FFmpeg.js engine ready.");
                }
                break;

            // worker started job
            case "run":
                if (this.debug) {
                    console.log('FFmpeg.js worker started job');
                }
                break;

            // job finished with some result
            case "done":
                if (this.debug) {
                    let buf = msg.data.MEMFS[0].data;
                    var result = new Blob(buf, {type: 'audio/mp3'});
                    this.addFileInfo(result);

                    console.log('FFmpeg.js worker finished job with result:', result);

                    // XXX: notify others
                }
                break;

            // FFmpeg printed to stdout
            case "stdout":
                this.stdout += msg.data + "\n";
                break;

            // FFmpeg printed to stderr
            case "stderr":
                this.stderr += msg.data + "\n";
                break;

            // FFmpeg exited
            case "exit":
                console.log("FFmpeg.js process exited with code " + msg.data);
                console.log(this.stdout);
                // this.engine.terminate();
                break;

            // error occured
            case "error":
                this.player().trigger('error', msg.data);
                break;
        }
    }
}

// expose plugin
videojs.FFmpegjsEngine = FFmpegjsEngine;

export default FFmpegjsEngine;
