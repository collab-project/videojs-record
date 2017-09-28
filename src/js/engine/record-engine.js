/**
 * @file record-engine.js
 * @since 2.0.0
 */

const Component = videojs.getComponent('Component');

// supported recorder plugin engines
const RECORDRTC = 'recordrtc';
const LIBVORBISJS = 'libvorbis.js';
const RECORDERJS = 'recorder.js';
const LAMEJS = 'lamejs';
const OPUSRECORDER = 'opus-recorder';

/**
 * Base class for recorder backends.
 * @class
 * @augments videojs.Component
 */
class RecordEngine extends Component {
    /**
     * Remove any temporary data and references to streams.
     * @private
     */
    dispose() {
        // dispose previous recording
        if (this.recordedData !== undefined) {
            URL.revokeObjectURL(this.recordedData);
        }
    }

    /**
     * Add filename and timestamp to recorded file object.
     *
     * @param {(blob|file)} fileObj - Blob or File object.
     */
    addFileInfo(fileObj) {
        let now = new Date();
        fileObj.lastModifiedDate = now;

        // guess extension name from mime type, e.g. audio/ogg, but
        // any extension is valid here. Chrome also accepts extended
        // mime types like video/webm;codecs=h264,vp9,opus
        let fileExtension = '.' + fileObj.type.split('/')[1];
        if (fileExtension.indexOf(';') > -1) {
            fileExtension = fileExtension.split(';')[0];
        }

        // use timestamp in filename, e.g. 1451180941326.ogg
        fileObj.name = now.getTime() + fileExtension;
    }

    /**
     * Invoked when recording is stopped and resulting stream is available.
     *
     * @param {blob} data - Reference to the recorded Blob.
     */
    onStopRecording(data) {
        this.recordedData = data;

        // add filename and timestamp to recorded file object
        this.addFileInfo(this.recordedData);

        // remove reference to recorded stream
        this.dispose();

        // notify listeners
        this.trigger('recordComplete');
    }
}

// expose component for external plugins
videojs.RecordEngine = RecordEngine;
Component.registerComponent('RecordEngine', RecordEngine);

export {
    RecordEngine,
    RECORDRTC, LIBVORBISJS, RECORDERJS, LAMEJS, OPUSRECORDER
}
