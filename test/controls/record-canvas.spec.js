/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers';

import RecordCanvas from '../../src/js/controls/record-canvas';


/** @test {record-canvas} */
describe('controls.RecordCanvas', () => {
    let player;

    beforeEach(() => {
        // create new player
        player = TestHelpers.makePlayer();
    });

    afterEach(() => {
        player.dispose();
    });

    it('creates the correct DOM element', () => {
        let canvas = new RecordCanvas(player);

        expect(canvas.el().nodeName).toEqual('DIV');
        expect(canvas.on).toBeFunction();
        expect(canvas.hasClass('vjs-record-canvas')).toBeTrue();
        expect(canvas.el().innerHTML).toEqual('<canvas></canvas>');
    });
});