/**
 * @since 4.6.0
 */

import TestHelpers from '../test-helpers';

import CountdownOverlay from '../../src/js/controls/countdown-overlay';
import Event from '../../src/js/event';


/** @test {countdown-overlay} */
describe('controls.CountdownOverlay', () => {
    let player;

    beforeEach(() => {
        // create new player
        player = TestHelpers.makeAudioVideoPlayer({
            plugins: {
                record: {
                    countdown: [
                        {value: '2', time: 1000},
                        {value: '1', time: 1000},
                    ],
                }
            }
        });
    });

    afterEach(() => {
        player.dispose();
    });

    it('creates the correct DOM element', () => {
        let countdown = new CountdownOverlay(player);

        expect(countdown.el().nodeName).toEqual('DIV');
        expect(countdown.hasClass('vjs-record-countdown')).toBeTrue();
        expect(countdown.el().innerHTML).toEqual('<span></span>');
    });

    it('countdown overlay appears', () => {
        let countdown = new CountdownOverlay(player);

        player.one(Event.DEVICE_READY, () => {
            // start
            player.record().start();

            setTimeout(() => {
                // overlay is visible
                expect(countdown.el().hasClass('vjs-hidden')).toBeFalse();
                // overlay is not empty
                expect(countdown.el().innerHTML).not.toEqual('<span></span>');

                // stop
                player.record().stop();

                done();
            }, 1000);
        });

        player.one(Event.READY, () => {
            player.record().getDevice();
        });
    });
});