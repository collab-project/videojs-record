/**
 * @file record-toggle.js
 */

const Button = videojs.getComponent('Button');
const Component = videojs.getComponent('Component');

/**
 * Button to toggle between start and stop recording.
 * @class
 * @augments videojs.Button
*/
class RecordToggle extends Button {
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
        if (!recorder.isRecording()) {
            recorder.start();
        } else {
            recorder.stop();
        }
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

        // change the button text
        this.controlText('Stop');
    }

    /**
     * Add the vjs-icon-record-start class to the element so it can change appearance.
     *
     * @param {EventTarget~Event} [event]
     *        The event that caused this function to run.
     *
     * @listens Player#stopRecord
     */
    onStop() {
        // replace element class so it can change appearance
        this.removeClass('vjs-icon-record-stop');
        this.addClass('vjs-icon-record-start');

        // change the button text
        this.controlText('Record');
    }
}

/**
 * The text that should display over the `RecordToggle`s controls. Added for localization.
 *
 * @type {string}
 * @private
 */
RecordToggle.prototype.controlText_ = 'Record';

Component.registerComponent('RecordToggle', RecordToggle);

export default RecordToggle;
