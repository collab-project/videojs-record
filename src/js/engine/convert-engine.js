/**
 * @file convert-engine.js
 * @since 3.3.0
 */

const Component = videojs.getComponent('Component');

// supported converter plugin engines
const TSEBML = 'ts-ebml';
// all convert plugins
const CONVERT_PLUGINS = [TSEBML];

/**
 * Base class for converter backends.
 * @class
 * @augments videojs.Component
 */
class ConvertEngine extends Component {
    /**
     * Creates an instance of this class.
     *
     * @param  {Player} player
     *         The `Player` that this class should be attached to.
     *
     * @param  {Object} [options]
     *         The key/value store of player options.
     */
    constructor(player, options) {
        // auto mixin the evented mixin (required since video.js v6.6.0)
        options.evented = true;

        super(player, options);
    }
}

// expose component for external plugins
videojs.ConvertEngine = ConvertEngine;
Component.registerComponent('ConvertEngine', ConvertEngine);

export {
    ConvertEngine, CONVERT_PLUGINS, TSEBML
};
