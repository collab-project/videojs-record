/**
 * @file gifshot-plugin.js
 * @since 3.0.0
 */

const RecordEngine = videojs.getComponent('RecordEngine');

/**
 * Animated GIF engine for the Gifshot library.
 *
 * @class
 * @augments videojs.RecordEngine
 */
class GifshotEngine extends RecordEngine {
    /**
     * Setup recording engine.
     */
    setup(stream, mediaType, debug) {
        this.inputStream = stream;
        this.mediaType = mediaType;
        this.debug = debug;

        console.log('hey');
    }

    /**
     * Start recording.
     */
    start() {
        
    }

    /**
     * Stop recording.
     */
    stop() {
        
    }
}

// expose plugin
videojs.GifshotEngine = GifshotEngine;

export default GifshotEngine;
