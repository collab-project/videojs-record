/**
 * @since 2.2.0
 */

import AnimationDisplay from '../../src/js/controls/animation-display.js';


/** @test {animation-display} */
describe('controls.AnimationDisplay', function() {

    it('creates the correct DOM element', function() {
        let display = new AnimationDisplay();

        expect(display.el().nodeName).toEqual('DIV');
        expect(display.on).toBeFunction();
        expect(display.hasClass('vjs-animation-display')).toBeTrue();
        expect(display.el().innerHTML).toEqual('<img>');
    });
});