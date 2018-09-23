/**
 * @file vmsg-plugin.js
 * @since 3.0.0
 */

import { Recorder } from 'vmsg';

const RecordEngine = videojs.getComponent('RecordEngine');

/**
 * Audio-only engine for the vmsg library.
 *
 * @class
 * @augments videojs.RecordEngine
 */
class VmsgEngine extends RecordEngine {
    /**
     * Setup recording engine.
     */
    setup(stream, mediaType, debug) {
        this.inputStream = stream;
        this.mediaType = mediaType;
        this.debug = debug;
        this.audioType = 'audio/mp3';

        this.config = {
            wasmURL: this.audioWorkerURL
            //shimURL: this.sampleRate
        };

        this.engine = new Recorder(this.config,
            this.onRecordingAvailable.bind(this));
        this.engine.stream = this.inputStream;
        this.engine.initWorker().then(() => {
            console.log('worker ready');
        }).catch((err) => {
            console.log(err);
        });
    }

    /**
     * Start recording.
     */
    start() {
        this.engine.startRecording();
        /*
        if (!this.stream) throw new Error("missing audio initialization");
        if (!this.worker) throw new Error("missing worker initialization");
        this.blob = null;
        if (this.blobURL) URL.revokeObjectURL(this.blobURL);
        this.blobURL = null;
        this.resolve = null;
        this.reject = null;
        this.worker.postMessage({type: "start", data: this.audioCtx.sampleRate});
        this.encNode.onaudioprocess = (e) => {
          const samples = e.inputBuffer.getChannelData(0);
          this.worker.postMessage({type: "data", data: samples});
        };
        this.encNode.connect(this.audioCtx.destination);
        */
    }

    /**
     * Stop recording.
     */
    stop() {
        this.engine.stopRecording();
        /*
        if (!this.stream) throw new Error("missing audio initialization");
        if (!this.worker) throw new Error("missing worker initialization");
        this.encNode.disconnect();
        this.encNode.onaudioprocess = null;
        // Might be missed in Safari and old FF/Chrome per MDN.
        if (this.stream.getTracks) {
          // Hide browser's recording indicator.
          this.stream.getTracks().forEach((track) => track.stop());
        }
        this.worker.postMessage({type: "stop", data: null});
        return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;
        });
        */
    }

    /**
     * @private
     */
    onRecordingAvailable(blob) {
        this.onStopRecording(blob);
    }
}

// expose plugin
videojs.VmsgEngine = VmsgEngine;

export default VmsgEngine;
