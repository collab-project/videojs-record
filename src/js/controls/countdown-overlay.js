/**
 * @file countdown-overlay.js
 * @since 4.5.0
 */

import videojs from 'video.js';

const Component = videojs.getComponent('Component');

/**
 * Overlay for displaying the countdown.
 *
 * @class
 * @augments videojs.Component
 */
class CountdownOverlay extends Component {
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
        this.el().firstChild.innerText = value;
    }
}

Component.registerComponent('CountdownOverlay', CountdownOverlay);

export default CountdownOverlay;
