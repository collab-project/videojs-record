/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers';

import Event from '../../src/js/event';
import CameraButton from '../../src/js/controls/camera-button';


/** @test {camera-button} */
describe('controls.CameraButton', () => {
    let player;
    let playerWithPrerecorder;
    let originalTimeout;

    beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

        // create new image-only player
        player = TestHelpers.makeImageOnlyPlayer();

        // create new image-only player with a pre-recorder
        playerWithPrerecorder = TestHelpers.makeImageOnlyPlayer({
            plugins: {
                record: {
                    image: true,
                    countdown: [
                        {value: '3', time: 1000},
                        {value: '2', time: 1000},
                        {value: '1', time: 1000},
                    ],
                    debug: true
                }
            }
        }, 'imageOnlyPrerecorder');
    });

    afterEach(() => {
        player.dispose();
        playerWithPrerecorder.dispose();

        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('creates the correct DOM element', () => {
        let button = new CameraButton(player);

        expect(button.el().nodeName).toEqual('BUTTON');
        expect(button.on).toBeFunction();
        expect(button.enabled_).toBeTrue();
        expect(button.controlText_).toEqual('Image');

        let styleClasses = ['vjs-camera-button', 'vjs-control', 'vjs-button',
            'vjs-icon-photo-camera'];
        styleClasses.forEach((e) => {
            expect(button.hasClass(e)).toBeTrue();
        });
    });

    it('can be disabled', () => {
        let button = new CameraButton(player);
        button.disable();
        expect(button.enabled_).toBeFalse();
    });

    it('changes appearance when startRecord or stopRecord is triggered', (done) => {
        let button = new CameraButton(player);

        expect(button.hasClass('vjs-icon-photo-camera')).toBeTrue();

        player.one(Event.START_RECORD, () => {
            expect(button.hasClass('vjs-icon-photo-camera')).toBeFalse();
            expect(button.hasClass('vjs-icon-replay')).toBeTrue();
            expect(button.controlText_).toEqual('Retry');

            setTimeout(() => {
                // stop recording
                // not sure if it makes any sense here, because done() is called after the click
                button.trigger('click');

                done();
            }, 2000);
        });
        player.one(Event.STOP_RECORD, () => {
            // not sure when it's called, dead code?
            expect(button.hasClass('vjs-icon-replay')).toBeFalse();
            expect(button.hasClass('vjs-icon-photo-camera')).toBeTrue();
            expect(button.controlText_).toEqual('Image');

            done();
        });
        player.one(Event.DEVICE_READY, () => {
            button.trigger('click');
        });

        player.one(Event.READY, () => {
            player.record().getDevice();
        });
    });

    it('changes appearance when startRecord or stopRecord is triggered and pre-recorder is on', (done) => {
        let button = new CameraButton(playerWithPrerecorder);

        expect(button.hasClass('vjs-icon-photo-camera')).toBeTrue();

        playerWithPrerecorder.one(Event.PRERECORDER_START, () => {
            setTimeout(() => {
                expect(button.controlText_).toEqual('Reset');
            }, 2000);
        });
        playerWithPrerecorder.one(Event.START_RECORD, () => {
            expect(button.hasClass('vjs-icon-photo-camera')).toBeFalse();
            expect(button.hasClass('vjs-icon-replay')).toBeTrue();
            expect(button.controlText_).toEqual('Reset');

            setTimeout(() => {
                expect(button.hasClass('vjs-icon-photo-camera')).toBeFalse();
                expect(button.hasClass('vjs-icon-replay')).toBeTrue();
                // it took a photo after 3-2-1 countdown
                expect(button.controlText_).toEqual('Retry');

                done();
            }, 4000);
        });

        playerWithPrerecorder.one(Event.DEVICE_READY, () => {
            button.trigger('click');
        });

        playerWithPrerecorder.one(Event.READY, () => {
            playerWithPrerecorder.record().getDevice();
        });
    });

    it('changes appearance when stopRecord is triggered and pre-recorder is on', (done) => {
        let button = new CameraButton(playerWithPrerecorder);

        expect(button.hasClass('vjs-icon-photo-camera')).toBeTrue();

        playerWithPrerecorder.one(Event.PRERECORDER_START, () => {
            setTimeout(() => {
                expect(button.controlText_).toEqual('Reset');
            }, 500);
        });
        playerWithPrerecorder.one(Event.RETRY, () => {
            expect(button.hasClass('vjs-icon-replay')).toBeFalse();
            expect(button.hasClass('vjs-icon-photo-camera')).toBeTrue();
            expect(button.controlText_).toEqual('Image');

            done();
        });
        playerWithPrerecorder.one(Event.PRERECORDER_START, () => {
            setTimeout(() => {
                // Stop the pre-recording
                button.trigger('click');
            }, 1000);
        });
        playerWithPrerecorder.one(Event.DEVICE_READY, () => {
            button.trigger('click');
        });

        playerWithPrerecorder.one(Event.READY, () => {
            playerWithPrerecorder.record().getDevice();
        });
    });
});