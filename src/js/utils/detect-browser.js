/**
 * @file detect-browser.js
 */

import window from 'global/window';

/**
 * Browser detector.
 *
 * @private
 * @return {object} result containing browser, version and minVersion
 *     properties.
 */
const detectBrowser = function() {
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

    // Firefox
    if (navigator.mozGetUserMedia) {
        result.browser = 'firefox';
        result.version = extractVersion(navigator.userAgent,
            /Firefox\/([0-9]+)\./, 1);
        result.minVersion = 31;
        return result;
    }

    // Chrome/Chromium/Webview
    if (navigator.webkitGetUserMedia && window.webkitRTCPeerConnection) {
        result.browser = 'chrome';
        result.version = extractVersion(navigator.userAgent,
            /Chrom(e|ium)\/([0-9]+)\./, 2);
        result.minVersion = 38;
        return result;
    }

    // Edge
    if (navigator.mediaDevices &&
        navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
        result.browser = 'edge';
        result.version = extractVersion(navigator.userAgent,
            /Edge\/(\d+).(\d+)$/, 2);
        result.minVersion = 10547;
        return result;
    }
    // Non-supported browser default
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
const extractVersion = function(uastring, expr, pos) {
    let match = uastring.match(expr);
    return match && match.length >= pos && parseInt(match[pos], 10);
}

const isEdge = function() {
    return detectBrowser().browser === 'edge';
}

const isOpera = function() {
    return !!window.opera || navigator.userAgent.indexOf('OPR/') !== -1;
}

const isChrome = function() {
    return detectBrowser().browser === 'chrome';
}

export {
    detectBrowser, isEdge, isOpera, isChrome
}
