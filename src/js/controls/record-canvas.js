/**
 * @file record-canvas
 * @since 2.0.0
 */

const Component = videojs.getComponent('Component');

/**
 * Canvas for displaying snapshot image.
 * @private
 * @class
 * @augments videojs.Component
*/
class RecordCanvas extends Component {
    /**
     * The constructor function for the class.
     *
     * @private
     * @param {(videojs.Player|Object)} player - Video.js player instance.
     * @param {Object} options - Player options.
     */
    constructor(player, options) {
        super(player, options);
    }
}

export default RecordCanvas;
