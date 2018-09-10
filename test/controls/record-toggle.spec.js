/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers.js';

import RecordToggle from '../../src/js/controls/record-toggle.js';


/** @test {record-toggle} */
describe('controls.RecordToggle', () => {
    var player;

    beforeEach(() => {
        // create new player
        player = TestHelpers.makePlayer();
    });

    afterEach(() => {
        player.dispose();
    });

    it('creates the correct DOM element', () => {
        let toggle = new RecordToggle(player);

        expect(toggle.el().nodeName).toEqual('BUTTON');
        expect(toggle.on).toBeFunction();
        expect(toggle.enabled_).toBeTrue();
        expect(toggle.controlText_).toEqual('Record');

        let styleClasses = ['vjs-record-button', 'vjs-control', 'vjs-button',
            'vjs-icon-record-start'];
        styleClasses.forEach((e) => {
            expect(toggle.hasClass(e)).toBeTrue();
        });
    });

    it('can be disabled', (done) => {
        let toggle = new RecordToggle(player);

        player.one('ready', () => {
            toggle.disable();
            expect(toggle.enabled_).toBeFalse();

            done();
        });
    });

    it('change appearance when startRecord or stopRecord is triggered', (done) => {
        let toggle = new RecordToggle(player);

        expect(toggle.hasClass('vjs-icon-record-start')).toBeTrue();

        player.one('ready', () => {
            player.trigger('startRecord');

            expect(toggle.hasClass('vjs-icon-record-start')).toBeFalse();
            expect(toggle.hasClass('vjs-icon-record-stop')).toBeTrue();
            expect(toggle.controlText_).toEqual('Stop');

            player.trigger('stopRecord');

            expect(toggle.hasClass('vjs-icon-record-stop')).toBeFalse();
            expect(toggle.hasClass('vjs-icon-record-start')).toBeTrue();
            expect(toggle.controlText_).toEqual('Record');

            done();
        });
    });

    it('accept interaction', (done) => {
        let toggle = new RecordToggle(player);

        player.one('deviceReady', () => {
            // start
            toggle.trigger('click');
            expect(player.record().isRecording()).toBeTrue();

            done();
        });

        player.one('ready', () => {
            player.record().getDevice();
        });
    });
});