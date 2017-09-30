/**
 * @file opus-recorder-plugin.js
 * @since 1.1.0
 */

const RecordEngine = videojs.getComponent('RecordEngine');

/**
 * Audio-only engine for the opus-recorder library.
 *
 * Audio is encoded using libopus.
 *
 * @class
 * @augments videojs.RecordEngine
 */
class OpusRecorderEngine extends RecordEngine {
    /**
     * Setup recording engine.
     */
    setup(stream, mediaType, debug) {
        this.inputStream = stream;
        this.mediaType = mediaType;
        this.debug = debug;

        this.engine = new Recorder({
            leaveStreamOpen: true,
            numberOfChannels: this.audioChannels,
            bufferLength: this.bufferSize,
            encoderSampleRate: this.sampleRate,
            encoderPath: this.audioWorkerURL
        });
        this.engine.addEventListener('dataAvailable',
            this.onRecordingAvailable.bind(this));

        this.engine.stream = stream;
        this.engine.sourceNode = this.engine.audioContext.createMediaStreamSource(
            stream);
        this.engine.sourceNode.connect(this.engine.filterNode ||
            this.engine.scriptProcessorNode);
        this.engine.sourceNode.connect(this.engine.monitorNode);
        this.engine.eventTarget.dispatchEvent(new Event('streamReady'));
    }

    /**
     * Start recording.
     */
    start() {
        this.engine.start();
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
     */
    onRecordingAvailable(data) {
        // Opus format stored in an Ogg container
        let blob = new Blob([data.detail], {type: 'audio/ogg'});

        this.onStopRecording(blob);
    }
}

// expose plugin
videojs.OpusRecorderEngine = OpusRecorderEngine;

export default OpusRecorderEngine;
