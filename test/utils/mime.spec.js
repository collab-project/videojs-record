/**
 * @since 4.0.0
 */

import TestHelpers from '../test-helpers';

import getExtension from '../../src/js/utils/mime';

/** @test {mime} */
describe('utils.mime', () => {
    /** @test {getExtension} */
    it('get correct extension', () => {
        expect(getExtension("video/x-matroska;codecs=avc1,opus")).toEqual('mkv');
        expect(getExtension("video/webm;codecs=vp8")).toEqual('webm');
        expect(getExtension("video/webm;codecs=vp9")).toEqual('webm');
        expect(getExtension("video/webm;codecs=H264")).toEqual('webm');
        expect(getExtension("video/webm;codecs=vp8,opus")).toEqual('webm');
        expect(getExtension("video/mp4")).toEqual('mp4');
        expect(getExtension("audio/wav")).toEqual('wav');
        expect(getExtension("audio/mpeg")).toEqual('mp3');
        expect(getExtension("audio/ogg")).toEqual('oga');
    });
});
