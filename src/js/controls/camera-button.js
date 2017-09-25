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

    onStart() {
        // replace element class so it can change appearance
        this.removeClass('vjs-icon-photo-camera');
        this.addClass('vjs-icon-photo-retry');

        // update label
        this.el().firstChild.firstChild.innerHTML = this.localize('Retry');
    }

    onStop() {
        // replace element class so it can change appearance
        this.removeClass('vjs-icon-photo-retry');
        this.addClass('vjs-icon-photo-camera');

        // update label
        this.el().firstChild.firstChild.innerHTML = this.localize('Image');
    }
}

export default CameraButton;
