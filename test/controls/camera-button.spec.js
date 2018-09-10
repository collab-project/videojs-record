/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers.js';

import CameraButton from '../../src/js/controls/camera-button.js';


/** @test {camera-button} */
describe('controls.CameraButton', () => {
    var player;
    var originalTimeout;

    beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

        // create new image-only player
        player = TestHelpers.makeImageOnlyPlayer();
    });

    afterEach(() => {
        player.dispose();

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

        player.one('startRecord', () => {
            expect(button.hasClass('vjs-icon-photo-camera')).toBeFalse();
            expect(button.hasClass('vjs-icon-replay')).toBeTrue();
            expect(button.controlText_).toEqual('Retry');

            setTimeout(() => {
                // stop recording
                button.trigger('click');

                done();
            }, 2000);
        });
        player.one('stopRecord', () => {
            expect(button.hasClass('vjs-icon-replay')).toBeFalse();
            expect(button.hasClass('vjs-icon-photo-camera')).toBeTrue();
            expect(button.controlText_).toEqual('Image');

            done();
        });
        player.one('deviceReady', () => {
            button.trigger('click');
        });

        player.one('ready', () => {
            player.record().getDevice();
        });
    });

});