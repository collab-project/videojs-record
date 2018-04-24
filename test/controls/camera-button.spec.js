/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers.js';

import CameraButton from '../../src/js/controls/camera-button.js';


/** @test {camera-button} */
describe('controls.CameraButton', function() {
    var player;
    var originalTimeout;

    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

        // create new image-only player
        player = TestHelpers.makeImageOnlyPlayer();
    });

    afterEach(function() {
        player.dispose();

        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('should create the correct DOM element', function() {
        let button = new CameraButton(player);

        expect(button.el().nodeName).toEqual('BUTTON');
        expect(button.on).toBeFunction();
        expect(button.enabled_).toEqual(true);
        expect(button.controlText_).toEqual('Image');

        ['vjs-camera-button', 'vjs-control', 'vjs-button', 'vjs-icon-photo-camera'].forEach(
        (e) => {
            expect(button.hasClass(e)).toEqual(true);
        });
    });

    it('should disable', function() {
        let button = new CameraButton(player);
        button.disable();
        expect(button.enabled_).toBeFalse();
    });

    it('should change appearance when startRecord or stopRecord is triggered', function(done) {
        let button = new CameraButton(player);

        expect(button.hasClass('vjs-icon-photo-camera')).toEqual(true);

        player.one('ready', function() {
            player.trigger('startRecord');

            expect(button.hasClass('vjs-icon-photo-camera')).toEqual(false);
            expect(button.hasClass('vjs-icon-replay')).toEqual(true);
            expect(button.controlText_).toEqual('Retry');

            player.trigger('stopRecord');

            expect(button.hasClass('vjs-icon-replay')).toEqual(false);
            expect(button.hasClass('vjs-icon-photo-camera')).toEqual(true);
            expect(button.controlText_).toEqual('Image');

            done();
        });
    });


});