/**
 * @file libvorbis-plugin.js
 * @since 1.1.0
 */

const RecordEngine = videojs.getComponent('RecordEngine');

/**
 * Audio-only engine for the libvorbis.js library.
 *
 * @class
 * @augments RecordEngine
 */
class LibVorbisEngine extends RecordEngine {
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
        try {
            this.engine.stop();
        } catch (err) {
            // ignore errors about invalid state
        }
    }

    /**
     * @private
     * @param {Object} event - ondataavailable responded with data object.
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
