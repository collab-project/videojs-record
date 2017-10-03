/**
 * @file camera-button.js
 * @since 2.0.0
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
    }

    /**
     * Builds the default DOM `className`.
     *
     * @return {string}
     *         The DOM `className` for this object.
     */
    buildCSSClass() {
        return 'vjs-camera-button vjs-control vjs-icon-photo-camera';
    }

    /**
     * This gets called when the button is clicked.
     *
     * @param {EventTarget~Event} event
     *        The `tap` or `click` event that caused this function to be
     *        called.
     *
     * @listens tap
     * @listens click
     */
    onClick(event) {
        // stop this event before it bubbles up
        event.stopImmediatePropagation();

        let recorder = this.player_.record();

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
     * Add the vjs-icon-replay class to the element so it can change appearance.
     *
     * @param {EventTarget~Event} [event]
     *        The event that caused this function to run.
     *
     * @listens Player#startRecord
     */
    onStart(event) {
        // replace element class so it can change appearance
        this.removeClass('vjs-icon-photo-camera');
        this.addClass('vjs-icon-replay');

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
    onStop(event) {
        // replace element class so it can change appearance
        this.removeClass('vjs-icon-replay');
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
