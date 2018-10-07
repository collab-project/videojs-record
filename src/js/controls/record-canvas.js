/**
 * @file record-canvas
 * @since 2.0.0
 */

const Component = videojs.getComponent('Component');

/**
 * Component for displaying images on a `canvas` element.
 *
 * @class
 * @augments videojs.Component
*/
class RecordCanvas extends Component {

    /**
     * Create the `RecordCanvas`s DOM element.
     *
     * @return {Element}
     *         The dom element that gets created.
     */
    createEl() {
        return super.createEl('div', {
            className: 'vjs-record-canvas',
            innerHTML: '<canvas></canvas>'
        });
    }

    /**
     * Clear the `RecordCanvas`s `canvas` element.
     */
    clear() {
        let canvas = this.el().firstChild;

        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    }

    /**
     * Draw `ImageData` frame onto `canvas` element.
     *
     * @param {ImageData} [imgData] - ImageData to draw onto canvas.
     */
    drawFrame(imgData) {
        let canvas = this.el().firstChild;

        // set the image size to the dimensions of the recorded animation
        canvas.width = imgData.width;
        canvas.height = imgData.height;

        canvas.getContext('2d').putImageData(
            imgData, 0, 0, 0, 0,
            imgData.width,
            imgData.height
        );
    }

    /**
     * Draw image onto `canvas` element.
     *
     * @param {HTMLElement} [element] - HTML element to draw onto canvas.
     */
    drawImage(element) {
        let canvas = this.el().firstChild;

        canvas.getContext('2d').drawImage(
            element, 0, 0,
            canvas.width,
            canvas.height
        );
    }
}

Component.registerComponent('RecordCanvas', RecordCanvas);

export default RecordCanvas;
