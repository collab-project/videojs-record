/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers.js';

import RecordToggle from '../../src/js/controls/record-toggle.js';


/** @test {record-toggle} */
describe('controls.RecordToggle', function() {
    var player;

    beforeEach(function() {
        // cleanup all players
        TestHelpers.cleanup();

        // create new player
        player = TestHelpers.makePlayer();
    });

    it('should create the correct DOM element', function() {
        let toggle = new RecordToggle(player);

        expect(toggle.el().nodeName).toEqual('BUTTON');
        expect(toggle.on).toBeFunction();
        expect(toggle.enabled_).toBeTrue();
        expect(toggle.controlText_).toEqual('Record');

        ['vjs-record-button', 'vjs-control', 'vjs-button', 'vjs-icon-record-start'].forEach(
        (e) => {
            expect(toggle.hasClass(e)).toBeTrue();
        });
    });

    it('should disable', function() {
        let toggle = new RecordToggle(player);
        toggle.disable();
        expect(toggle.enabled_).toBeFalse();
    });

    it('should change appearance when startRecord or stopRecord is triggered', function() {
        let toggle = new RecordToggle(player);

        expect(toggle.hasClass('vjs-icon-record-start')).toBeTrue();

        player.trigger('startRecord');

        expect(toggle.hasClass('vjs-icon-record-start')).toBeFalse();
        expect(toggle.hasClass('vjs-icon-record-stop')).toBeTrue();
        expect(toggle.controlText_).toEqual('Stop');

        player.trigger('stopRecord');

        expect(toggle.hasClass('vjs-icon-record-stop')).toBeFalse();
        expect(toggle.hasClass('vjs-icon-record-start')).toBeTrue();
        expect(toggle.controlText_).toEqual('Record');
    });

    it('should accept interaction', function() {
        let toggle = new RecordToggle(player);

        // start
        toggle.trigger('click');
        expect(player.record()._recording).toBeTrue();

        // stop
        toggle.trigger('click');
        expect(player.record()._recording).toBeFalse();
    });
});