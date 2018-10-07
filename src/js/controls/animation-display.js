/**
 * @file animation-display.js
 * @since 2.0.0
 */

const Component = videojs.getComponent('Component');

/**
 * Component for displaying animated GIF images.
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

    /**
     * Set `src` of image element.
     */
    load(data) {
        let img = this.el().firstChild;

        img.src = data;
    }
}

Component.registerComponent('AnimationDisplay', AnimationDisplay);

export default AnimationDisplay;
