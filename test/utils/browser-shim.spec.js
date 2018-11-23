/**
 * @since 2.2.0
 */

import setSrcObject from '../../src/js/utils/browser-shim.js';

/** @test {browser-shim} */
describe('utils.setSrcObject', () => {

    /** @test {setSrcObject} */
    it('throws error when no valid srcObject is found', () => {
        expect(() => {
            setSrcObject({}, {}, false);
        }).toThrow(
            new Error('createObjectURL/srcObject both are not supported.')
        );
    });
});