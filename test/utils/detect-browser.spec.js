/**
 * @since 2.2.0
 */

import * as detectBrowser from '../../src/js/utils/detect-browser.js';

/** @test {detect-browser} */
describe('utils.isChrome', function() {

    /** @test {isChrome} */
    it('should detect Chrome browser', function() {
        let chrome = detectBrowser.isChrome();
        expect(chrome).toBeTrue();
    });
});