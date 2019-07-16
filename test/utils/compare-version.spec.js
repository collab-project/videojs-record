/**
 * @since 3.8.0
 */

import compareVersion from '../../src/js/utils/compare-version.js';


/** @test {compare-version} */
describe('utils.compare-version', () => {

    /** @test {compareVersion} */
    it('compares versions properly', () => {
        expect(compareVersion('0.4', '0.5')).toEqual(-1);
        expect(compareVersion('0.3', '0.33')).toEqual(-1);
        expect(compareVersion('1.2.0', '1.2.0')).toEqual(0);
        expect(compareVersion('1.2.0', '1.1.0')).toEqual(1);
        expect(compareVersion('2.0.0', '1.9.0')).toEqual(1);
    });
});
