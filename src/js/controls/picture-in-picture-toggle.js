/**
 * @file picture-in-picture-toggle.js
 * @since 3.5.0
 */

import videojs from 'video.js';

const Button = videojs.getComponent('Button');
const Component = videojs.getComponent('Component');

/**
 * Button to toggle Picture-in-Picture mode.
 *
 * @class
 * @augments videojs.Button
*/
class PictureInPictureToggle extends Button {
    /**
     * Builds the default DOM `className`.
     *
     * @return {string}
     *         The DOM `className` for this object.
     */
    buildCSSClass() {
        return 'vjs-pip-button vjs-control vjs-button vjs-icon-picture-in-picture';
    }

    /**
     * Enable the `PictureInPictureToggle` element so that it can be activated or clicked.
     */
    enable() {
        super.enable();

        //this.on(this.player_, 'startRecord', this.onStart);
        //this.on(this.player_, 'stopRecord', this.onStop);
    }

    /**
     * Disable the `PictureInPictureToggle` element so that it cannot be activated or clicked.
     */
    disable() {
        super.disable();

        //this.off(this.player_, 'startRecord', this.onStart);
        //this.off(this.player_, 'stopRecord', this.onStop);
    }

    /**
     * Show the `PictureInPictureToggle` element if it is hidden by removing the
     * 'vjs-hidden' class name from it.
     */
    show() {
        if (this.layoutExclude && this.layoutExclude === true) {
            // ignore
            return;
        }
        super.show();
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
    async handleClick(event) {
        let recorder = this.player_.record();

        // disable button during picture-in-picture switch
        this.disable();

        try {
            if (recorder.mediaElement !== document.pictureInPictureElement) {
                // request picture-in-picture
                await recorder.mediaElement.requestPictureInPicture();
            } else {
                // exit picture-in-picture
                await recorder.mediaElement.exitPictureInPicture();
            }
        } catch (error) {
            // notify listeners
            this.player.trigger('error', error);
        } finally {
            // ready
            this.enable();
        }
        /*
        if (!recorder.isRecording()) {
            recorder.start();
        } else {
            recorder.stop();
        }
        */
    }

    /**
     * Add the vjs-icon-record-stop class to the element so it can change appearance.
     *
     * @param {EventTarget~Event} [event]
     *        The event that caused this function to run.
     *
     * @listens Player#startRecord
     */
    onStart(event) {
        // replace element class so it can change appearance
        this.removeClass('vjs-icon-record-start');
        this.addClass('vjs-icon-record-stop');
    }

    /**
     * Add the vjs-icon-record-start class to the element so it can change appearance.
     *
     * @param {EventTarget~Event} [event]
     *        The event that caused this function to run.
     *
     * @listens Player#stopRecord
     */
    onStop(event) {
        // replace element class so it can change appearance
        this.removeClass('vjs-icon-record-stop');
        this.addClass('vjs-icon-record-start');
    }
}

/**
 * The text that should display over the `PictureInPictureToggle`s controls.
 *
 * Added for localization.
 *
 * @type {string}
 * @private
 */
PictureInPictureToggle.prototype.controlText_ = 'Picture in Picture';

Component.registerComponent('PictureInPictureToggle', PictureInPictureToggle);

export default PictureInPictureToggle;
