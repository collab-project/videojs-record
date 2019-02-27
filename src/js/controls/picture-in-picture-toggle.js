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
        return 'vjs-pip-button vjs-control vjs-button vjs-icon-picture-in-picture-start';
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

        // switch picture-in-picture mode
        try {
            if (recorder.mediaElement !== document.pictureInPictureElement) {
                // replace element class so it can change appearance
                this.removeClass('vjs-icon-picture-in-picture-start');
                this.addClass('vjs-icon-picture-in-picture-stop');

                // request picture-in-picture
                await recorder.mediaElement.requestPictureInPicture();
            } else {
                // replace element class so it can change appearance
                this.removeClass('vjs-icon-picture-in-picture-stop');
                this.addClass('vjs-icon-picture-in-picture-start');

                // exit picture-in-picture
                await document.exitPictureInPicture();
            }
        } catch (error) {
            // notify listeners
            this.player_.trigger('error', error);
        } finally {
            // switch completed
            this.enable();
        }
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
