/**
 * @since 2.2.0
 */

import formatTime from '../../src/js/utils/format-time';

/** @test {format-time} */
describe('utils.formatTime', () => {
    beforeAll(() => {
        videojs.resetFormatTime();
    });

    /** @test {formatTime} */
    it('returns a formatted string for seconds', () => {
        let time = formatTime(10);
        expect(time).toEqual('00:10');

        time = formatTime(11);
        expect(time).toEqual('00:11');

        time = formatTime(121);
        expect(time).toEqual('02:01');

        time = formatTime(3661);
        expect(time).toEqual('01:01:01');

        // 300 days, 1 hour and 1 second
        time = formatTime(25923601);
        expect(time).toEqual('300:01:00:01');
    });

    /** @test {formatTime} */
    it('returns a formatted string using a guide', () => {
        let time = formatTime(4.121, 10);
        expect(time).toEqual('00:04');

        // using one hour as guide
        time = formatTime(4.121, 3600);
        expect(time).toEqual('00:00:04');

        // using one day as guide
        time = formatTime(4.121, 86400);
        expect(time).toEqual('00:00:00:04');
    });

    /** @test {formatTime} */
    it('returns a formatted string using displayMilliseconds option', () => {
        let time = formatTime(123.652, 10, false);
        expect(time).toEqual('02:03');

        time = formatTime(7.652, 4.652, false);
        expect(time).toEqual('00:07');

        // using one day as guide (will ignore option)
        time = formatTime(12.034, 86400, true);
        expect(time).toEqual('00:00:00:12');
    });

    /** @test {formatTime} */
    it('returns a string when no arguments are received', () => {
        let time = formatTime();

        expect(time).toEqual('00:00');
    });

    /** @test {formatTime} */
    it('defaults to 0 when a negative value is received', () => {
        let time = formatTime(-2);

        expect(time).toEqual('00:00');
    });
});
