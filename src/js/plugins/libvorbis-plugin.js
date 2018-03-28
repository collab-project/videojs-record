/**
 * @file libvorbis-plugin.js
 * @since 1.1.0
 */

const RecordEngine = videojs.getComponent('RecordEngine');

/**
 * Audio-only engine for the libvorbis.js library.
 *
 * @class
 * @augments videojs.RecordPlugin
 */
class LibVorbisEngine extends RecordEngine {
    /**
     * Setup recording engine.
     */
    setup(stream, mediaType, debug) {
        this.inputStream = stream;
        this.mediaType = mediaType;
        this.debug = debug;

        // setup libvorbis.js
        this.options = {
            audioBitsPerSecond: this.sampleRate
        };
    }

    /**
     * Start recording.
     */
    start() {
        this.chunks = [];
        this.engine = new VorbisMediaRecorder(this.inputStream,
            this.options);
        this.engine.ondataavailable = this.onData.bind(this);
        this.engine.onstop = this.onRecordingAvailable.bind(this);

        this.engine.start();
    }

    /**
     * Stop recording.
     */
    stop() {
        this.engine.stop();
    }

    /**
     * @private
     */
    onData(event) {
        this.chunks.push(event.data);
    }

    /**
     * @private
     */
    onRecordingAvailable() {
        let blob = new Blob(this.chunks, {type: this.chunks[0].type});
        this.chunks = [];
        this.onStopRecording(blob);
    }
}

// expose plugin
videojs.LibVorbisEngine = LibVorbisEngine;

export default LibVorbisEngine;
