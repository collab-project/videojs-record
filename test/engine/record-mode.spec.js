/**
 * @since 2.2.0
 */

import {IMAGE_ONLY, AUDIO_ONLY, VIDEO_ONLY, AUDIO_VIDEO, ANIMATION, SCREEN_ONLY, getRecorderMode} from '../../src/js/engine/record-mode';

/** @test {record-mode} */
describe('engine.record-mode', () => {

    it('provides available recorder modes', () => {
        expect(IMAGE_ONLY).toEqual('image_only');
        expect(AUDIO_ONLY).toEqual('audio_only');
        expect(VIDEO_ONLY).toEqual('video_only');
        expect(AUDIO_VIDEO).toEqual('audio_video');
        expect(ANIMATION).toEqual('animation');
        expect(SCREEN_ONLY).toEqual('screen_only');
    });

    it('returns the correct recorder mode', () => {
        // accepts boolean
        expect(getRecorderMode(false, false, false, false, true)).toEqual(SCREEN_ONLY);
        expect(getRecorderMode(false, false, false, true, false)).toEqual(ANIMATION);
        expect(getRecorderMode(false, false, true, false, false)).toEqual(VIDEO_ONLY);
        expect(getRecorderMode(false, true, false, false, false)).toEqual(AUDIO_ONLY);
        expect(getRecorderMode(true, false, false, false, false)).toEqual(IMAGE_ONLY);
        expect(getRecorderMode(false, true, true, false, false)).toEqual(AUDIO_VIDEO);
        expect(getRecorderMode(false, false, false, false, false)).toBeUndefined();

        // and object
        expect(getRecorderMode(false, false, false, false, {})).toEqual(SCREEN_ONLY);
        expect(getRecorderMode(false, false, false, {}, false)).toEqual(ANIMATION);
        expect(getRecorderMode(false, false, {}, false, false)).toEqual(VIDEO_ONLY);
        expect(getRecorderMode(false, {}, false, false, false)).toEqual(AUDIO_ONLY);
        expect(getRecorderMode({}, false, false, false, false)).toEqual(IMAGE_ONLY);
        expect(getRecorderMode(false, {}, {}, false, false)).toEqual(AUDIO_VIDEO);
    });
});