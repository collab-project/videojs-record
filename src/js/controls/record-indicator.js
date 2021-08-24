/**
 * @file record-indicator.js
 * @since 2.0.0
 */

import videojs from 'video.js';

import Event from '../event';

const Component = videojs.getComponent('Component');

/**
 * Icon indicating recording is active.
 *
 * @class
 * @augments videojs.Component
*/
class RecordIndicator extends Component {
    /**
     * The constructor function for the class.
     *
     * @private
     * @param {(videojs.Player|Object)} player - Video.js player instance.
     * @param {Object} options - Player options.
     */
    constructor(player, options) {
        super(player, options);

        this.enable();
    }

    /**
     * Create the `RecordIndicator`s DOM element.
     *
     * @return {Element}
     *         The dom element that gets created.
     */
    createEl() {
        let props = {
            className: 'vjs-record-indicator vjs-control',
            dir: 'ltr'
        };
        let attr = {
            'data-label': this.localize('REC')
        };
        return super.createEl('div', props, attr);
    }

    /**
     * Enable event handlers.
     */
    enable() {
        this.on(this.player_, Event.START_RECORD, this.show);
        this.on(this.player_, Event.PROGRESS_RECORD, this.onProgress);
        this.on(this.player_, Event.STOP_RECORD, this.hide);
    }

    /**
     * Disable event handlers.
     */
    disable() {
        this.off(this.player_, Event.START_RECORD, this.show);
        this.off(this.player_, Event.PROGRESS_RECORD, this.onProgress);
        this.off(this.player_, Event.STOP_RECORD, this.hide);
    }

    /**
     * Show the `RecordIndicator` element if it is hidden by removing the
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
     * Displays current recording time instead of REC
     * @param {Object} label - formatted time.
     */
    setProgressValue(label) {
        this.el().dataset.label = label;
    }

    /**
     * Invoked during recording and displays the remaining time.
     */
    onProgress() {
        let recorder = this.player_.record();
        let now = performance.now();
        let duration = recorder.maxLength;
        let currentTime = (now - (recorder.startTime +
            recorder.pausedTime)) / 1000; // buddy ignore:line

        this.setProgressValue(recorder._formatTime(Math.min(currentTime, duration), duration, recorder.displayMilliseconds));
    }
}

Component.registerComponent('RecordIndicator', RecordIndicator);

export default RecordIndicator;
