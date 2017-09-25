/**
 * @file record-indicator.js
 */

const Component = videojs.getComponent('Component');

/**
 * Icon indicating recording is active.
 * @private
 * @class
 * @augments videojs.Component
*/
class RecordIndicator extends Component {
    /**
     * The constructor function for the class.
     *
     * @private
     * @param {(videojs.Player|Object)} player - Video.js player instance.
     * @param {Object} options - Player options.
     */
    constructor(player, options) {
        super(player, options);

        this.on(player, 'startRecord', this.show);
        this.on(player, 'stopRecord', this.hide);
    }

    disable() {
        // disable record indicator event handlers
        this.off(this.player(), 'startRecord', this.show);
        this.off(this.player(), 'stopRecord', this.hide);
    }
}

export default RecordIndicator;
