/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers';

import AnimationDisplay from '../../src/js/controls/animation-display';


/** @test {animation-display} */
describe('controls.AnimationDisplay', () => {
    let player;

    beforeEach(() => {
        // create new player
        player = TestHelpers.makePlayer();
    });

    afterEach(() => {
        player.dispose();
    });

    it('creates the correct DOM element', () => {
        let display = new AnimationDisplay(player);

        expect(display.el().nodeName).toEqual('DIV');
        expect(display.on).toBeFunction();
        expect(display.hasClass('vjs-animation-display')).toBeTrue();
        expect(display.el().innerHTML).toEqual('<img>');
    });
});