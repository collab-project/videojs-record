/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers.js';

import RecordIndicator from '../../src/js/controls/record-indicator.js';


/** @test {record-indicator} */
describe('controls.RecordIndicator', () => {
    let player;

    beforeEach(() => {
        // create new player
        player = TestHelpers.makePlayer();
    });

    afterEach(() => {
        player.dispose();
    });

    it('creates the correct DOM element', () => {
        let indicator = new RecordIndicator(player);

        expect(indicator.el().nodeName).toEqual('DIV');
        expect(indicator.on).toBeFunction();
        expect(indicator.hasClass('vjs-record-indicator')).toBeTrue();
        expect(indicator.hasClass('vjs-control')).toBeTrue();
        expect(indicator.el().dir).toEqual('ltr');
    });

    it('can be disabled', () => {
        let indicator = new RecordIndicator(player);
        indicator.disable();
    });
});