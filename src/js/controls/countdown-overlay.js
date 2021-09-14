/**
 * @file countdown-overlay.js
 * @since 4.6.0
 */

import videojs from 'video.js';
import Event from '../event';

const Component = videojs.getComponent('Component');

/**
 * Overlay for displaying the countdown.
 *
 * @class
 * @augments videojs.Component
 */
class CountdownOverlay extends Component {

    /**
     * The constructor function for the class.
     *
     * @private
     * @param {(videojs.Player|Object)} player - Video.js player instance.
     * @param {Object} options - Player options.
     */
    constructor(player, options) {
        super(player, options);

        this.on(this.player_, Event.PRERECORDER_START, this.onPrerecorderStart);
        this.on(this.player_, Event.PRERECORDER_FINISH, this.onPrerecorderFinish);
        this.on(this.player_, Event.PRERECORDER_ABORT, this.onPrerecorderAbort);
    }

    /**
     * Create the `Countdown`s DOM element.
     *
     * @return {Element}
     *         The dom element that gets created.
     */
    createEl() {
        const spanElement = videojs.dom.createEl('span');
        const el = super.createEl('div', {
            className: 'vjs-record-countdown',
            dir: 'ltr'
        });
        el.appendChild(spanElement);

        return el;
    }

    /**
     * Show the `CountdownOverlay` element if it is hidden by removing the
     * 'vjs-hidden' class name from it.
     */
    show() {
        if (this.layoutExclude && this.layoutExclude === true) {
            // ignore
            return;
        }
        super.show();
    }

    setCountdownValue(value) {
        if (this.el().firstChild) {
            this.el().firstChild.innerText = value;
        } else {
            window.console.error('videojs-record countdown overlay is missing');
        }
    }

    /**
     * Show prerecorder overlay
     *
     * @param {EventTarget~Event} [event]
     *        The event that caused this function to run.
     *
     * @todo unit test
     */
    onPrerecorderStart(event) {
        this.show();
    }

    /**
     * Hide prerecorder overlay
     *
     * @param {EventTarget~Event} [event]
     *        The event that caused this function to run.
     *
     * @todo unit test
     */
    onPrerecorderFinish(event) {
        this.setCountdownValue('');
        this.hide();
    }

    /**
     * Hide prerecorder overlay
     *
     * @param {EventTarget~Event} [event]
     *        The event that caused this function to run.
     *
     * @todo unit test
     */
    onPrerecorderAbort(event) {
        this.setCountdownValue('');
        this.hide();
    }
}

Component.registerComponent('CountdownOverlay', CountdownOverlay);

export default CountdownOverlay;
