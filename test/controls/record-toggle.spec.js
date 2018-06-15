/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers.js';

import RecordToggle from '../../src/js/controls/record-toggle.js';


/** @test {record-toggle} */
describe('controls.RecordToggle', function() {
    var player;

    beforeEach(function() {
        // create new player
        player = TestHelpers.makePlayer();
    });

    afterEach(function() {
        player.dispose();
    });

    it('create the correct DOM element', function() {
        let toggle = new RecordToggle(player);

        expect(toggle.el().nodeName).toEqual('BUTTON');
        expect(toggle.on).toBeFunction();
        expect(toggle.enabled_).toEqual(true);
        expect(toggle.controlText_).toEqual('Record');

        ['vjs-record-button', 'vjs-control', 'vjs-button', 'vjs-icon-record-start'].forEach(
        (e) => {
            expect(toggle.hasClass(e)).toEqual(true);
        });
    });

    it('disable', function(done) {
        let toggle = new RecordToggle(player);

        player.one('ready', function() {
            toggle.disable();
            expect(toggle.enabled_).toEqual(false);

            done();
        })
    });

    it('change appearance when startRecord or stopRecord is triggered', function(done) {
        let toggle = new RecordToggle(player);

        expect(toggle.hasClass('vjs-icon-record-start')).toEqual(true);

        player.one('ready', function() {
            player.trigger('startRecord');

            expect(toggle.hasClass('vjs-icon-record-start')).toEqual(false);
            expect(toggle.hasClass('vjs-icon-record-stop')).toEqual(true);
            expect(toggle.controlText_).toEqual('Stop');

            player.trigger('stopRecord');

            expect(toggle.hasClass('vjs-icon-record-stop')).toEqual(false);
            expect(toggle.hasClass('vjs-icon-record-start')).toEqual(true);
            expect(toggle.controlText_).toEqual('Record');

            done();
        });
    });

    it('accept interaction', function(done) {
        let toggle = new RecordToggle(player);

        player.one('deviceReady', function() {
            // start
            toggle.trigger('click');
            expect(player.record().isRecording()).toEqual(true);

            done();
        });

        player.one('ready', function() {
            player.record().getDevice();
        });
    });
});