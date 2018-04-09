/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers.js';

import RecordIndicator from '../../src/js/controls/record-indicator.js';


/** @test {record-indicator} */
describe('controls.RecordIndicator', function() {
    var player;

    beforeEach(function() {
        // cleanup all players
        TestHelpers.cleanup();

        // create new player
        player = TestHelpers.makePlayer();
    });

    it('should create the correct DOM element', function() {
        let indicator = new RecordIndicator(player);

        expect(indicator.el().nodeName).toEqual('DIV');
        expect(indicator.on).toBeFunction();
        expect(indicator.hasClass('vjs-record-indicator')).toBeTrue();
        expect(indicator.hasClass('vjs-control')).toBeTrue();
        expect(indicator.el().dir).toEqual('ltr')
    });

    it('should disable', function() {
        let indicator = new RecordIndicator(player);
        indicator.disable();
    });
});