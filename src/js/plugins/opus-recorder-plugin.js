/**
 * @file opus-recorder-plugin.js
 * @since 1.1.0
 */

import videojs from 'video.js';

const RecordEngine = videojs.getComponent('RecordEngine');

/**
 * Audio-only engine for the opus-recorder library.
 *
 * Audio is encoded using libopus.
 *
 * @class
 * @augments RecordEngine
 */
class OpusRecorderEngine extends RecordEngine {
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

        // also supports 'audio/wav'; but make sure to use waveEncoder worker
        // in that case
        this.audioType = 'audio/ogg';

        this.engine = new Recorder({
            leaveStreamOpen: true,
            numberOfChannels: this.audioChannels,
            bufferLength: this.bufferSize,
            encoderSampleRate: this.sampleRate,
            encoderPath: this.audioWorkerURL
        });
        this.engine.ondataavailable = this.onRecordingAvailable.bind(this);

        let AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        this.audioSourceNode = this.audioContext.createMediaStreamSource(
            this.inputStream);
    }

    /**
     * Start recording.
     */
    start() {
        this.engine.start(this.audioSourceNode).then(() => {
            // recording started ok
        }).catch((err) => {
            // can't start playback
            this.player().trigger('error', err);
        });
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
     * @param {Object} data - Audio data returned by opus-recorder.
     */
    onRecordingAvailable(data) {
        // Opus format stored in an Ogg container
        let blob = new Blob([data], {type: this.audioType});

        this.onStopRecording(blob);
    }
}

// expose plugin
videojs.OpusRecorderEngine = OpusRecorderEngine;

export default OpusRecorderEngine;
