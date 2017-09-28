/**
 * @file record-mode.js
 * @since 2.0.0
 */

import {IMAGE_ONLY, AUDIO_ONLY, VIDEO_ONLY, AUDIO_VIDEO, ANIMATION} from '../engine/record-engine';


const getRecorderMode = function(image, audio, video, animation) {
    if (isModeEnabled(image)) {
        return IMAGE_ONLY;

    } else if (isModeEnabled(animation)) {
        return ANIMATION;

    } else if (isModeEnabled(audio) && !isModeEnabled(video)) {
        return AUDIO_ONLY;

    } else if (isModeEnabled(audio) && isModeEnabled(video)) {
        return AUDIO_VIDEO;

    } else if (!isModeEnabled(audio) && isModeEnabled(video)) {
        return VIDEO_ONLY;
    }
}

/**
 * Return boolean indicating whether mode is enabled or not.
 */
const isModeEnabled = function(mode) {
    return mode === Object(mode) || mode === true;
}

export default getRecorderMode;
