/**
 * @since 2.2.0
 */

import window from 'global/window';

import TestHelpers from '../test-helpers.js';

import * as detectBrowser from '../../src/js/utils/detect-browser.js';


/** @test {detect-browser} */
describe('utils.detect-browser', function() {

    /** @test {isChrome} */
    it('should detect Chrome browser', function() {
        let cleanup = false;
        if (!window.navigator.webkitGetUserMedia) {
            window.navigator.webkitGetUserMedia = cleanup = true;
        }

        let chrome = detectBrowser.isChrome();
        expect(chrome).toBeTrue();

        if (cleanup) {
            delete window.navigator.webkitGetUserMedia;
        }
    });

    /** @test {detectBrowser} */
    it('should detect Firefox', function() {
        let cleanup = false;
        if (!window.navigator.mozGetUserMedia) {
            window.navigator.mozGetUserMedia = cleanup = true;
        }

        let result = detectBrowser.detectBrowser();
        expect(result.browser).toEqual('firefox');

        if (cleanup) {
            delete window.navigator.mozGetUserMedia;
        }
    });

    /** @test {detectBrowser} */
    it('should detect unknown browser', function() {
        var originalNav = window.navigator;
        window['__defineGetter__']('navigator', function() {
            return false;
        });
        let unknown = detectBrowser.detectBrowser();
        expect(unknown).toEqual({
            browser: 'Not a supported browser.',
            version: null,
            minVersion: null
        });
        window['__defineGetter__']('navigator', function() {
            return originalNav;
        });
    });
});