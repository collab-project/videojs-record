/**
 * @file record-toggle.js
 */

const Button = videojs.getComponent('Button');

/**
 * Button to toggle between start and stop recording.
 * @private
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

    onStart() {
        // replace element class so it can change appearance
        this.removeClass('vjs-icon-record-start');
        this.addClass('vjs-icon-record-stop');

        // update label
        this.el().firstChild.firstChild.innerHTML = this.localize('Stop');
    }

    onStop() {
        // replace element class so it can change appearance
        this.removeClass('vjs-icon-record-stop');
        this.addClass('vjs-icon-record-start');

        // update label
        this.el().firstChild.firstChild.innerHTML = this.localize('Record');
    }
}

export default RecordToggle;
