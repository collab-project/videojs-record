/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers.js';

import CameraButton from '../../src/js/controls/camera-button.js';


/** @test {camera-button} */
describe('controls.CameraButton', function() {
    var player;

    beforeEach(function() {
        // cleanup all players
        TestHelpers.cleanup();

        // create new player
        player = TestHelpers.makePlayer();
    });

    it('should create the correct DOM element', function() {
        let button = new CameraButton(player);

        expect(button.el().nodeName).toEqual('BUTTON');
        expect(button.on).toBeFunction();
        expect(button.enabled_).toBeTrue();
        expect(button.controlText_).toEqual('Image');

        ['vjs-camera-button', 'vjs-control', 'vjs-button', 'vjs-icon-photo-camera'].forEach(
        (e) => {
            expect(button.hasClass(e)).toBeTrue();
        });
    });

    it('should disable', function() {
        let button = new CameraButton(player);
        button.disable();
        expect(button.enabled_).toBeFalse();
    });

    it('should change appearance when startRecord or stopRecord is triggered', function() {
        let button = new CameraButton(player);

        expect(button.hasClass('vjs-icon-photo-camera')).toBeTrue();

        player.trigger('startRecord');

        expect(button.hasClass('vjs-icon-photo-camera')).toBeFalse();
        expect(button.hasClass('vjs-icon-replay')).toBeTrue();
        expect(button.controlText_).toEqual('Retry');

        player.trigger('stopRecord');

        expect(button.hasClass('vjs-icon-replay')).toBeFalse();
        expect(button.hasClass('vjs-icon-photo-camera')).toBeTrue();
        expect(button.controlText_).toEqual('Image');
    });

    it('should accept interaction', function() {
        let button = new CameraButton(player);

        button.trigger('click');

        expect(player.record()._recording).toBeTrue();

        // try again
        button.trigger('click');
    });

});