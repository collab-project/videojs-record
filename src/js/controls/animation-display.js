/**
 * @file animation-display.js
 * @since 2.0.0
 */

const Component = videojs.getComponent('Component');

/**
 * Image for displaying animated GIF image.
 * @private
 * @class
 * @augments videojs.Component
*/
class AnimationDisplay extends Component {
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

export default AnimationDisplay;
