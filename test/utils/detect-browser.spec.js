/**
 * @since 2.2.0
 */

import window from 'global/window';

import TestHelpers from '../test-helpers';

import host from 'host-environment';

import * as detectBrowser from '../../src/js/utils/detect-browser';


/** @test {detect-browser} */
describe('utils.detect-browser', () => {

    /** @test {isChrome} */
    it('detects Chrome browser', () => {
        let runningChromeHost = (host.browser.chrome !== false);
        let isChrome = detectBrowser.isChrome();

        expect(isChrome).toEqual(runningChromeHost);
    });

    /** @test {detectBrowser} */
    it('detects Firefox browser', () => {
        let runningFirefoxHost = (host.browser.firefox !== false);
        let isFirefox = detectBrowser.isFirefox();

        expect(isFirefox).toEqual(runningFirefoxHost);
    });

    /** @test {detectBrowser} */
    it('detects Edge browser', () => {
        let runningEdgeHost = (host.browser.IE !== false);
        let isEdge = detectBrowser.isEdge();

        expect(isEdge).toEqual(runningEdgeHost);
    });

    /** @test {detectBrowser} */
    it('detects Safari browser', () => {
        let runningSafariHost = (host.browser.safari !== false);
        let isSafari = detectBrowser.isSafari();

        expect(isSafari).toEqual(runningSafariHost);
    });

    /** @test {detectBrowser} */
    it('detects Opera browser', () => {
        let isOpera = detectBrowser.isOpera();

        expect(isOpera).toBeFalse();
    });

    /** @test {detectBrowser} */
    it('detects unknown browser', () => {
        let originalNav = window.navigator;
        window['__defineGetter__']('navigator', () => {
            return false;
        });
        let unknown = detectBrowser.detectBrowser();
        expect(unknown).toEqual({
            browser: 'Not a supported browser.',
            version: null,
            minVersion: null
        });
        window['__defineGetter__']('navigator', () => {
            return originalNav;
        });
    });
});