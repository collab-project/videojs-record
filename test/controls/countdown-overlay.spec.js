/**
 * @since 4.6.0
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

    // @todo-coachup move to videojs.record.spec.ts
    it('start record after the countdown', (done) => {
        let toggle = new RecordToggle(player);

        player.one(Event.DEVICE_READY, () => {
            // start
            toggle.trigger('click');

            setTimeout(() => {
                // recording is started after the countdown
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

    it('no record during the countdown', (done) => {
        let toggle = new RecordToggle(player);

        player.one(Event.DEVICE_READY, () => {
            const onRecordStarted = () => {
                expect(true).toBe(false);
            };
            player.one(Event.START_RECORD, onRecordStarted);
            setTimeout(() => {
                // recording is not started during the countdown
                player.off(Event.START_RECORD, onRecordStarted);
            }, 2000);

            // start
            toggle.trigger('click');

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

    it('recording is not started during the countdown', (done) => {
        let toggle = new RecordToggle(player);

        player.one(Event.DEVICE_READY, () => {
            // start
            toggle.trigger('click');

            setTimeout(() => {
                expect(player.record().isCountingDown()).toBeTrue();
            }, 1000);

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