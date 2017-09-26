/**
 * @file device-button.js
 */

const Button = videojs.getComponent('Button');
const Component = videojs.getComponent('Component');

/**
 * Button to select recording device.
 * @private
 * @class
 * @augments videojs.Button
*/
class DeviceButton extends Button {
    /**
     * The constructor function for the class.
     *
     * @private
     * @param {(videojs.Player|Object)} player - Video.js player instance.
     * @param {Object} options - Player options.
     */
    constructor(player, options) {
        super(player, options);

        this.on('click', this.onClick);
        this.on('tap', this.onClick);

        this.createControlTextEl(this.el());
    }

    onClick(e) {
        // stop this event before it bubbles up
        e.stopImmediatePropagation();

        // open device dialog
        this.player().recorder.getDevice();
    }
}

/**
 * The text that should display over the `DeviceButton`s controls. Added for localization.
 *
 * @type {string}
 * @private
 */
DeviceButton.prototype.controlText_ = 'Device';

Component.registerComponent('DeviceButton', DeviceButton);

export default DeviceButton;
