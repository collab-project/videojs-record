/**
 * @file gifshot-plugin.js
 * @since 3.0.0
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
     */
    setup(stream, mediaType, debug) {
        this.inputStream = stream;
        this.mediaType = mediaType;
        this.debug = debug;

        console.log('GifshotEngine ready.');
    }

    /**
     * Start recording.
     */
    start() {
        console.log('started recording');

        // By default, a user's webcam is used to create the animated GIF
        gifshot.createGIF({
            // Desired width of the image
            'gifWidth': 320,
            // Desired height of the image
            'gifHeight': 240,

            // The amount of time (in seconds) to wait between each frame capture
            'interval': 0.1,
            // The number of frames to use to create the animated GIF
            // Note: Each frame is captured every 100 milliseconds of a video and every ms for existing images
            'numFrames': 10,
            // The amount of time (10 = 1s) to stay on each frame
            'frameDuration': 1,

            // text that covers the animated GIF
            /*'text': new Date().toUTCString(),
            // The vertical text alignment of the text that covers the animated GIF
            'textBaseline': 'bottom',
            // The font weight of the text that covers the animated GIF
            'fontWeight': 'bold',
            // The font size of the text that covers the animated GIF
            'fontSize': '12px',
            // The minimum font size of the text that covers the animated GIF
            // Note: This option is only applied if the text being applied is cut off
            'minFontSize': '8px',
            // Whether or not the animated GIF text will be resized to fit within the GIF container
            'resizeFont': false,
            */

            // You can pass an existing video element to use for the webcam GIF creation process,
            // and this video element will not be hidden (useful when used with the keepCameraOn option)
            // Pro tip: Set the height and width of the video element to the same values as your future GIF
            // Another Pro Tip: If you use this option, the video will not be paused, the object url not revoked, and
            // the video will not be removed from the DOM.  You will need to handle this yourself.
            'webcamVideoElement': null,
            // Whether or not you would like the user's camera to stay on after the GIF is created
            // Note: The cameraStream Media object is passed back to you in the createGIF() callback function
            'keepCameraOn': true,
            // Expects a cameraStream Media object
            // Note: Passing an existing camera stream will allow you to create another GIF and/or snapshot without
            //  asking for the user's permission to access the camera again if you are not using SSL
            'cameraStream': this.inputStream
        }, this.onRecordingAvailable.bind(this));
    }

    /**
     * Stop recording.
     */
    stop() {
        console.log('stopped recording');
    }

    /**
     * @private
     */
    onRecordingAvailable(obj) {
        if (!obj.error) {
            console.log('recording:', obj);

            this.recordedData = obj.image;

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
