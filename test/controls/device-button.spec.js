/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers';

import Event from '../../src/js/event';
import DeviceButton from '../../src/js/controls/device-button';


/** @test {device-button} */
describe('controls.DeviceButton', () => {
    let player;

    beforeEach(() => {
        // create new player
        player = TestHelpers.makePlayer();
    });

    afterEach(() => {
        player.dispose();
    });

    it('creates the correct DOM element', () => {
        let button = new DeviceButton(player);

        expect(button.el().nodeName).toEqual('BUTTON');
        expect(button.on).toBeFunction();
        expect(button.enabled_).toBeTrue();
        expect(button.controlText_).toEqual('Device');
    });

    it('accepts interaction', (done) => {
        let button = new DeviceButton(player);

        player.one(Event.DEVICE_READY, () => {
            done();
        });

        player.one(Event.READY, () => {
            button.trigger('click');

            expect(player.record().mediaType).toBeDefined();
        });
    });
});