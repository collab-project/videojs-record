/**
 * @since 4.5.0
 */

import TestHelpers from '../test-helpers';

import CountdownOverlay from '../../src/js/controls/countdown-overlay';
import RecordToggle from '../../src/js/controls/record-toggle';
import Event from '../../src/js/event';


/** @test {countdown-overlay} */
describe('controls.CountdownOverlay', () => {
    let player;

    beforeEach(() => {
        // create new player
        player = TestHelpers.makeAudioVideoPlayer({
            plugins: {
                record: {
                    countdownOverlay: true,
                    countdownSteps: 2,
                    countdownTimeBetweenSteps: 1000
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

    it('start record after the countdown', (done) => {
        let toggle = new RecordToggle(player);

        player.one(Event.DEVICE_READY, () => {
            // start
            toggle.trigger('click');
            expect(player.record().isRecording()).toBeFalse();

            setTimeout(() => {
                // started after 2 seconds
                expect(player.record().isRecording()).toBeTrue();
            }, 3000);

            setTimeout(() => {
                // stop recording
                player.record().stop();
            }, 4000);
        });

        player.one(Event.FINISH_RECORD, () => {
            // wait till it's loaded before destroying
            // (XXX: create new event for this)
            setTimeout(done, 1000);
        });

        player.one(Event.READY, () => {
            player.record().getDevice();
        });
    });
});