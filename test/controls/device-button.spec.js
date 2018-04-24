/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers.js';

import DeviceButton from '../../src/js/controls/device-button.js';


/** @test {device-button} */
describe('controls.DeviceButton', function() {
    var player;

    beforeEach(function() {
        // create new player
        player = TestHelpers.makePlayer();
    });

    afterEach(function() {
        player.dispose();
    });

    it('should create the correct DOM element', function() {
        let button = new DeviceButton(player);

        expect(button.el().nodeName).toEqual('BUTTON');
        expect(button.on).toBeFunction();
        expect(button.enabled_).toEqual(true);
        expect(button.controlText_).toEqual('Device');
    });

    it('should accept interaction', function(done) {
        let button = new DeviceButton(player);

        player.one('deviceReady', function() {
            done();
        });

        player.one('ready', function() {
            button.trigger('click');

            expect(player.record().mediaType).toBeDefined();
        });
    });
});