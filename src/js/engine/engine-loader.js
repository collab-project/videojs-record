/**
 * @file engine-loader.js
 * @since 3.3.0
 */

import RecordRTCEngine from './record-rtc';
import {CONVERT_PLUGINS, TSEBML} from './convert-engine';
import {RECORDRTC, LIBVORBISJS, RECORDERJS, LAMEJS, OPUSRECORDER, VMSG, RECORD_PLUGINS} from './record-engine';

/**
 * Get audio plugin engine class.
 *
 * @private
 * @param {String} audioEngine - Name of the audio engine.
 * @returns {Object} Audio engine class.
 */
const getAudioEngine = function(audioEngine) {
    let AudioEngineClass;
    switch (audioEngine) {
        case RECORDRTC:
            // RecordRTC.js (default)
            AudioEngineClass = RecordRTCEngine;
            break;

        case LIBVORBISJS:
            // libvorbis.js
            AudioEngineClass = videojs.LibVorbisEngine;
            break;

        case RECORDERJS:
            // recorder.js
            AudioEngineClass = videojs.RecorderjsEngine;
            break;

        case LAMEJS:
            // lamejs
            AudioEngineClass = videojs.LamejsEngine;
            break;

        case OPUSRECORDER:
            // opus-recorder
            AudioEngineClass = videojs.OpusRecorderEngine;
            break;

        case VMSG:
            // vmsg
            AudioEngineClass = videojs.VmsgEngine;
            break;

        default:
            // unknown engine
            throw new Error('Unknown audioEngine: ' + audioEngine);
    }
    return AudioEngineClass;
};

/**
 * Check whether any audio record plugins are enabled.
 *
 * @private
 * @param {String} audioEngine - Name of the audio engine.
 * @returns {Boolean} Whether any audio plugins are enabled or not.
 */
const isAudioPluginActive = function(audioEngine) {
    return RECORD_PLUGINS.indexOf(audioEngine) > -1;
};

/**
 * Get converter plugin engine class.
 *
 * @private
 * @param {String} convertEngine - Name of the convert engine.
 * @returns {Object} Convert engine class.
 */
const getConvertEngine = function(convertEngine) {
    let ConvertEngineClass;
    switch (convertEngine) {
        case '':
            // disabled (default)
            break;

        case TSEBML:
            // ts-ebml
            ConvertEngineClass = videojs.TsEBMLEngine;
            break;

        default:
            // unknown engine
            throw new Error('Unknown convertEngine: ' + convertEngine);
    }
    return ConvertEngineClass;
};

export {
    getAudioEngine, isAudioPluginActive, getConvertEngine
};
