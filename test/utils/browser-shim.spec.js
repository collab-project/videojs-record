/**
 * @since 2.2.0
 */

import setSrcObject from '../../src/js/utils/browser-shim.js';

/** @test {browser-shim} */
describe('utils.setSrcObject', function() {

    /** @test {setSrcObject} */
    it('works', function() {
        let obj = setSrcObject({}, {}, false);
    });
});