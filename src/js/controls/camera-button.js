/**
 * @file camera-button.js
 */

const Button = videojs.getComponent('Button');

/**
 * Button to toggle between create and retry snapshot image.
 * @private
 * @class
 * @augments videojs.Button
*/
const CameraButton = videojs.extend(Button,
{
    /** @constructor */
    constructor: function(player, options)
    {
        Button.call(this, player, options);

        this.on('click', this.onClick);
        this.on('tap', this.onClick);
        this.on(player, 'startRecord', this.onStart);
        this.on(player, 'stopRecord', this.onStop);
    }
});

CameraButton.prototype.onClick = function(e)
{
    // stop this event before it bubbles up
    e.stopImmediatePropagation();

    var recorder = this.player().recorder;

    if (!recorder.isProcessing())
    {
        // create snapshot
        recorder.start();
    }
    else
    {
        // retry
        recorder.retrySnapshot();

        // reset camera button
        this.onStop();
    }
};

CameraButton.prototype.onStart = function()
{
    // replace element class so it can change appearance
    this.removeClass('vjs-icon-photo-camera');
    this.addClass('vjs-icon-photo-retry');

    // update label
    this.el().firstChild.firstChild.innerHTML = this.localize('Retry');
};

CameraButton.prototype.onStop = function()
{
    // replace element class so it can change appearance
    this.removeClass('vjs-icon-photo-retry');
    this.addClass('vjs-icon-photo-camera');

    // update label
    this.el().firstChild.firstChild.innerHTML = this.localize('Image');
};

export default CameraButton;
