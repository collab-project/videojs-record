/**
 * @since 2.2.0
 */

import setSrcObject from '../../src/js/utils/browser-shim.js';

/** @test {browser-shim} */
describe('utils.setSrcObject', () => {

    /** @test {setSrcObject} */
    it('works', () => {
        let obj = setSrcObject({}, {}, false);
    });
});