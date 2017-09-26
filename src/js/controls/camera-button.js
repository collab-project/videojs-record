/**
 * @file camera-button.js
 */

const Button = videojs.getComponent('Button');
const Component = videojs.getComponent('Component');

/**
 * Button to toggle between create and retry snapshot image.
 * @private
 * @class
 * @augments videojs.Button
*/
class CameraButton extends Button {
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
        this.on(player, 'startRecord', this.onStart);
        this.on(player, 'stopRecord', this.onStop);

        this.createControlTextEl(this.el());
    }

    onClick(e) {
        // stop this event before it bubbles up
        e.stopImmediatePropagation();

        let recorder = this.player().recorder;

        if (!recorder.isProcessing()) {
            // create snapshot
            recorder.start();
        } else {
            // retry
            recorder.retrySnapshot();

            // reset camera button
            this.onStop();
        }
    }

    /**
     * Add the vjs-icon-photo-retry class to the element so it can change appearance.
     *
     * @param {EventTarget~Event} [event]
     *        The event that caused this function to run.
     *
     * @listens Player#startRecord
     */
    onStart() {
        // replace element class so it can change appearance
        this.removeClass('vjs-icon-photo-camera');
        this.addClass('vjs-icon-photo-retry');

        // change the button text
        this.controlText('Retry');
    }

    /**
     * Add the vjs-icon-photo-camera class to the element so it can change appearance.
     *
     * @param {EventTarget~Event} [event]
     *        The event that caused this function to run.
     *
     * @listens Player#stopRecord
     */
    onStop() {
        // replace element class so it can change appearance
        this.removeClass('vjs-icon-photo-retry');
        this.addClass('vjs-icon-photo-camera');

        // change the button text
        this.controlText('Image');
    }
}

/**
 * The text that should display over the `CameraButton`s controls. Added for localization.
 *
 * @type {string}
 * @private
 */
CameraButton.prototype.controlText_ = 'Image';

Component.registerComponent('CameraButton', CameraButton);

export default CameraButton;
