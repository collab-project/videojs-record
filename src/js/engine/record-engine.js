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

    /**
     * Show save as dialog in browser so the user can store the recorded media
     * locally.
     *
     * @param {object} name - Object with names for the particular blob(s)
     *     you want to save. File extensions are added automatically. For
     *     example: {'video': 'name-of-video-file'}. Supported keys are
     *     'audio', 'video' and 'gif'.
     */
    saveAs(name) {
        let fileName = name[Object.keys(name)[0]];

        if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
            return navigator.msSaveOrOpenBlob(this.recordedData, fileName);
        } else if (typeof navigator.msSaveBlob !== 'undefined') {
            return navigator.msSaveBlob(this.recordedData, fileName);
        }

        let hyperlink = document.createElement('a');
        hyperlink.href = URL.createObjectURL(this.recordedData);
        hyperlink.download = fileName;

        hyperlink.style = 'display:none;opacity:0;color:transparent;';
        (document.body || document.documentElement).appendChild(hyperlink);

        if (typeof hyperlink.click === 'function') {
            hyperlink.click();
        } else {
            hyperlink.target = '_blank';
            hyperlink.dispatchEvent(new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            }));
        }

        URL.revokeObjectURL(hyperlink.href);
    }
}

// expose component for external plugins
videojs.RecordEngine = RecordEngine;
Component.registerComponent('RecordEngine', RecordEngine);

export {
    RecordEngine,
    RECORDRTC, LIBVORBISJS, RECORDERJS, LAMEJS, OPUSRECORDER
};
