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
        function(e) {
            expect(button.hasClass(e)).toBeTrue();
        });
    });

    it('should disable', function() {
        let button = new CameraButton(player);
        button.disable();
        expect(button.enabled_).toBeFalse();

        button.enable();
        expect(button.enabled_).toBeTrue();
    });

});