/**
 * @file record-base.js
 */

import window from 'global/window';

const Component = videojs.getComponent('Component');

// recorder modes
const IMAGE_ONLY = 'image_only';
const AUDIO_ONLY = 'audio_only';
const VIDEO_ONLY = 'video_only';
const AUDIO_VIDEO = 'audio_video';
const ANIMATION = 'animation';

// supported recorder plugin engines
const RECORDRTC = 'recordrtc';
const LIBVORBISJS = 'libvorbis.js';
const RECORDERJS = 'recorder.js';
const LAMEJS = 'lamejs';
const OPUSRECORDER = 'opus-recorder';


/**
 * Base class for recorder backends.
 * @class
 * @augments videojs.Component
 * @private
 */
class RecordBase extends Component {
    /**
     * The constructor function for the class.
     *
     * @private
     * @param {(videojs.Player|Object)} player - Video.js player instance.
     * @param {Object} options - Player options.
     */
    constructor(player, options) {
        super(player, options);
    }

    /**
     * Browser detector.
     *
     * @private
     * @return {object} result containing browser, version and minVersion
     *     properties.
     */
    detectBrowser() {
        // Returned result object.
        let result = {};
        result.browser = null;
        result.version = null;
        result.minVersion = null;

        // Non supported browser.
        if (typeof window === 'undefined' || !window.navigator) {
            result.browser = 'Not a supported browser.';
            return result;
        }

        // Firefox.
        if (navigator.mozGetUserMedia) {
            result.browser = 'firefox';
            result.version = this.extractVersion(navigator.userAgent,
                /Firefox\/([0-9]+)\./, 1);
            result.minVersion = 31;
            return result;
        }

        // Chrome/Chromium/Webview.
        if (navigator.webkitGetUserMedia && window.webkitRTCPeerConnection) {
            result.browser = 'chrome';
            result.version = this.extractVersion(navigator.userAgent,
                /Chrom(e|ium)\/([0-9]+)\./, 2);
            result.minVersion = 38;
            return result;
        }

        // Edge.
        if (navigator.mediaDevices &&
            navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
            result.browser = 'edge';
            result.version = this.extractVersion(navigator.userAgent,
                /Edge\/(\d+).(\d+)$/, 2);
            result.minVersion = 10547;
            return result;
        }
        // Non supported browser default.
        result.browser = 'Not a supported browser.';
        return result;
    }

    /**
     * Extract browser version out of the provided user agent string.
     *
     * @private
     * @param {!string} uastring - userAgent string.
     * @param {!string} expr - Regular expression used as match criteria.
     * @param {!number} pos - position in the version string to be
     *     returned.
     * @return {!number} browser version.
     */
    extractVersion(uastring, expr, pos) {
        let match = uastring.match(expr);
        return match && match.length >= pos && parseInt(match[pos], 10);
    }
    isEdge() {
        return this.detectBrowser().browser === 'edge';
    }
    isOpera() {
        return !!window.opera || navigator.userAgent.indexOf('OPR/') !== -1;
    }
    isChrome()
    {
        return this.detectBrowser().browser === 'chrome';
    }

    /**
     * Remove any temporary data and references to streams.
     * @private
     */
    dispose() {
        // remove previous recording
        if (this.mediaURL !== undefined) {
            URL.revokeObjectURL(this.mediaURL);
        }
    }

    /**
     * Add filename and timestamp to recorded file object.
     *
     * @param {(blob|file)} fileObj - Blob or File object.
     * @private
     */
    addFileInfo(fileObj) {
        let now = new Date();
        fileObj.lastModifiedDate = now;

        // guess extension name from mime type, e.g. audio/ogg, but
        // any extension is valid here. Chrome also accepts extended
        // mime types like video/webm;codecs=h264,vp9,opus
        let fileExtension = '.' + fileObj.type.split('/')[1];
        if (fileExtension.indexOf(';') > -1) {
            fileExtension = fileExtension.split(';')[0];
        }

        // use timestamp in filename, e.g. 1451180941326.ogg
        fileObj.name = now.getTime() + fileExtension;
    }

    /**
     * Invoked when recording is stopped and resulting stream is available.
     *
     * @param {blob} data - Reference to the recorded Blob.
     * @private
     */
    onStopRecording(data) {
        this.recordedData = data;

        this.addFileInfo(this.recordedData);

        // store reference to recorded stream URL
        this.dispose();
        this.mediaURL = URL.createObjectURL(this.recordedData);

        // notify listeners
        this.trigger('recordComplete');
    }
}

export {
    RecordBase,
    IMAGE_ONLY, AUDIO_ONLY, VIDEO_ONLY, AUDIO_VIDEO, ANIMATION,
    RECORDRTC, LIBVORBISJS, RECORDERJS, LAMEJS, OPUSRECORDER
}
