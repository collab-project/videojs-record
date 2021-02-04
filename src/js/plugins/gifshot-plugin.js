/**
 * @file gifshot-plugin.js
 * @since x.x.x
 */

import gifshot from 'gifshot';

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
     *
     * @param {LocalMediaStream} stream - Media stream to record.
     * @param {Object} mediaType - Object describing the media type of this
     *     engine.
     * @param {Boolean} debug - Indicating whether or not debug messages should
     *     be printed in the console.
     */
    setup(stream, mediaType, debug) {
        this.inputStream = stream;
        this.mediaType = mediaType;
        this.debug = debug;

        this.defaultOptions = {
            // Desired width of the image
            gifWidth: this.options_.width,
            // Desired height of the image
            gifHeight: this.options_.height,

            // Whether or not you would like the user's camera to stay on
            // after the GIF is created.
            // Note: The cameraStream Media object is passed back to you in
            // the createGIF() callback function
            keepCameraOn: true,
            // Expects a cameraStream Media object
            // Note: Passing an existing camera stream will allow you to
            // create another GIF and/or snapshot without asking for the user's
            // permission to access the camera again if you are not using SSL
            cameraStream: this.inputStream,
            // Whether or not you would like to save all of the canvas image
            // binary data from your created GIF
            // Note: This is particularly useful for when you want to re-use a
            // GIF to add text to later
            saveRenderingContexts: true
        };
    }

    /**
     * Start recording.
     */
    start() {
        //console.log('started recording');

        let opts = videojs.mergeOptions(this.defaultOptions,
            this.animationOptions);

        gifshot.createGIF(opts, this.onRecordingAvailable.bind(this));
    }

    /**
     * Stop recording.
     */
    stop() {
        //console.log('stopped recording');
    }

    /**
     * @private
     * @param {object} obj - TODO
     */
    onRecordingAvailable(obj) {
        if (!obj.error) {
            // save image data
            this.recordedData = obj.image;

            // save first frame
            this.recordedFrames = obj.savedRenderingContexts;

            // remove reference to recorded stream
            this.dispose();

            // notify listeners
            this.trigger('recordComplete');
        }
    }
}

// expose plugin
videojs.GifshotEngine = GifshotEngine;

export default GifshotEngine;
