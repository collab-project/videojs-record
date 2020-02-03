/**
 * @since 2.2.0
 */

import formatTime from '../../src/js/utils/format-time.js';

/** @test {format-time} */
describe('utils.formatTime', () => {

    /** @test {formatTime} */
    it('returns a formatted string for seconds', () => {
        let time = formatTime(10);
        expect(time).toEqual('0:10');

        time = formatTime(11);
        expect(time).toEqual('0:11');

        time = formatTime(119.85567);
        expect(time).toEqual('1:59');

        time = formatTime(121);
        expect(time).toEqual('2:01');

        time = formatTime(3661);
        expect(time).toEqual('1:01:01');
    });

    /** @test {formatTime} */
    it('returns a formatted string when using msDisplayMax', () => {
        let time = formatTime(2.011, 3, 10);
        expect(time).toEqual('0:02:011');

        time = formatTime(4.121, 3, 10);
        expect(time).toEqual('0:04:121');

        time = formatTime(6.001, 2, 20);
        expect(time).toEqual('0:06:001');

        time = formatTime(66.121, 2, 20);
        // XXX: should be 1:06:121
        expect(time).toEqual('1:06:60120');

        time = formatTime(179.95755102040818, 2, 20);
        // XXX: should be 2:59:957
        expect(time).toEqual('2:59:120957');
    });

    /** @test {formatTime} */
    it('returns a string when no arguments are received', () => {
        let time = formatTime();

        expect(time).toEqual('-:-');
    });

    /** @test {formatTime} */
    it('defaults to 0 when a negative value is received', () => {
        let time = formatTime(-2);

        expect(time).toEqual('0:00');
    });
});