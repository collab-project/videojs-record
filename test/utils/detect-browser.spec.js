/**
 * @since 2.2.0
 */

import window from 'global/window';

import TestHelpers from '../test-helpers.js';

import * as detectBrowser from '../../src/js/utils/detect-browser.js';

require('karma-host-environment');


/** @test {detect-browser} */
describe('utils.detect-browser', function() {

    /** @test {isChrome} */
    it('detects Chrome browser', function() {
        let runningChromeHost = (host.browser.chrome !== false);
        let isChrome = detectBrowser.isChrome();

        expect(isChrome).toEqual(runningChromeHost);
    });

    /** @test {detectBrowser} */
    it('detects Firefox browser', function() {
        let runningFirefoxHost = (host.browser.firefox !== false);
        let result = detectBrowser.detectBrowser();

        if (runningFirefoxHost) {
            expect(result.browser).toEqual('firefox');
        } else {
            expect(result.browser).not.toEqual('firefox');
        }
    });

    /** @test {detectBrowser} */
    it('detects Edge browser', function() {
        let runningEdgeHost = (host.browser.IE !== false);
        let isEdge = detectBrowser.isEdge();

        expect(isEdge).toEqual(runningEdgeHost);
    });

    /** @test {detectBrowser} */
    it('detects Safari browser', function() {
        let runningSafariHost = (host.browser.safari !== false);
        let isSafari = detectBrowser.isSafari();

        expect(isSafari).toEqual(runningSafariHost);
    });

    /** @test {detectBrowser} */
    it('detects Opera browser', function() {
        let isOpera = detectBrowser.isOpera();

        expect(isOpera).toBeFalse();
    });

    /** @test {detectBrowser} */
    it('detects unknown browser', function() {
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