/**
 * @file device-button.js
 */

const Button = videojs.getComponent('Button');

/**
 * Button to select recording device.
 * @private
 * @class
 * @augments videojs.Button
*/
const DeviceButton = videojs.extend(Button,
{
    /** @constructor */
    constructor: function(player, options)
    {
        Button.call(this, player, options);

        this.on('click', this.onClick);
        this.on('tap', this.onClick);
    }
});
DeviceButton.prototype.onClick = function(e)
{
    // stop this event before it bubbles up
    e.stopImmediatePropagation();

    // open device dialog
    this.player().recorder.getDevice();
};

export default DeviceButton;
