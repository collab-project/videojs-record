/**
 * @since 2.2.0
 */

import RecordCanvas from '../../src/js/controls/record-canvas.js';


/** @test {record-canvas} */
describe('controls.RecordCanvas', () => {

    it('creates the correct DOM element', () => {
        let canvas = new RecordCanvas();

        expect(canvas.el().nodeName).toEqual('DIV');
        expect(canvas.on).toBeFunction();
        expect(canvas.hasClass('vjs-record-canvas')).toBeTrue();
        expect(canvas.el().innerHTML).toEqual('<canvas></canvas>');
    });
});