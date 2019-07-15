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
            screen: false,
            maxLength: 10,
            maxFileSize: 0,
            msDisplayMax: 3,
            frameWidth: 320,
            frameHeight: 240,
            debug: false,
            pip: false,
            autoMuteDevice: false,
            videoBitRate: 1200,
            videoEngine: 'recordrtc',
            videoFrameRate: 30,
            videoMimeType: 'video/webm',
            videoRecorderType: 'auto',
            videoWorkerURL: '',
            videoWebAssemblyURL: '',
            audioEngine: 'recordrtc',
            audioRecorderType: 'auto',
            audioMimeType: 'auto',
            audioBufferSize: 4096,
            audioSampleRate: 44100,
            audioBitRate: 128,
            audioChannels: 2,
            audioWorkerURL: '',
            audioWebAssemblyURL: '',
            audioBufferUpdate: false,
            animationFrameRate: 200,
            animationQuality: 10,
            timeSlice: 0,
            convertEngine: '',
            convertWorkerURL: '',
            convertOptions: [],
            hotKeys: false,
            pluginLibraryOptions: {}
        });
    });
});
