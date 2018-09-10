/**
 * @since 2.2.0
 */

import pluginDefaultOptions from '../src/js/defaults.js';

/** @test {defaults} */
describe('pluginDefaultOptions', () => {

    /** @test {pluginDefaultOptions} */
    it('returns a non-empty object', () => {
        expect(pluginDefaultOptions).toBeNonEmptyObject();
    });

    /** @test {pluginDefaultOptions} */
    it('returns the correct default values', () => {
        expect(pluginDefaultOptions).toEqual({
            image: false,
            audio: false,
            video: false,
            animation: false,
            maxLength: 10,
            frameWidth: 320,
            frameHeight: 240,
            debug: false,
            autoMuteDevice: false,
            videoMimeType: 'video/webm',
            videoRecorderType: 'auto',
            audioEngine: 'recordrtc',
            audioRecorderType: 'auto',
            audioMimeType: 'auto',
            audioBufferSize: 4096,
            audioSampleRate: 44100,
            audioBitRate: 128,
            audioChannels: 2,
            audioWorkerURL: '',
            animationFrameRate: 200,
            animationQuality: 10,
            timeSlice: 0
        });
    });
});
