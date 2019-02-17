/**
 * @file animation-display.js
 * @since 2.0.0
 */

import videojs from 'video.js';

const Component = videojs.getComponent('Component');

/**
 * Image for displaying animated GIF image.
 *
 * @class
 * @augments videojs.Component
*/
class AnimationDisplay extends Component {

    /**
     * Create the `AnimationDisplay`s DOM element.
     *
     * @return {Element}
     *         The dom element that gets created.
     */
    createEl() {
        return super.createEl('div', {
            className: 'vjs-animation-display',
            innerHTML: '<img />'
        });
    }
}

Component.registerComponent('AnimationDisplay', AnimationDisplay);

export default AnimationDisplay;
