/**
 * @file videojs.record.libvorbis.js
 */

import RecordBase from '../engine/record-base';

/**
 * Audio-only engine for the libvorbis.js library.
 *
 * @class
 * @augments RecordBase
 */
class LibVorbisEngine extends RecordBase {
    /**
     * Setup recording engine.
     */
    setup(stream, mediaType, debug) {
        this.inputStream = stream;
        this.mediaType = mediaType;
        this.debug = debug;

        // setup libvorbis.js
        this.options = {
            audioBitsPerSecond: 32000
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

    onData(event) {
        this.chunks.push(event.data);
    }

    onRecordingAvailable() {
        let blob = new Blob(this.chunks, {type: this.chunks[0].type});
        this.chunks = [];
        this.onStopRecording(blob);
    }
}

export default LibVorbisEngine;
