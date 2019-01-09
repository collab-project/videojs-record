/**
 * @file ts-ebml-plugin.js
 * @since 3.3.0
 */

import {Decoder, Encoder, tools, Reader} from 'ts-ebml';

const ConvertEngine = videojs.getComponent('ConvertEngine');

/**
 * Converter engine using the ts-ebml library.
 *
 * Used to inject metadata, like duration, into webm files.
 *
 * @class
 * @augments videojs.ConvertEngine
 */
class TsEBMLEngine extends ConvertEngine {
    /**
     * Inject metadata.
     *
     * @param {Blob} data - Recorded data.
     */
    convert(data) {
        const decoder = new Decoder();
        const reader = new Reader();
        reader.logging = false;
        reader.drop_default_duration = false;

        // save timestamp
        const timestamp = new Date();
        timestamp.setTime(data.lastModified);

        // load and convert blob
        this.loadBlob(data).then((buffer) => {
            // decode
            const elms = decoder.decode(buffer);
            elms.forEach((elm) => {
                reader.read(elm);
            });
            reader.stop();

            // generate metadata
            let refinedMetadataBuf = tools.makeMetadataSeekable(
                reader.metadatas, reader.duration, reader.cues);
            let body = buffer.slice(reader.metadataSize);

            // create new blob
            let result = new Blob([refinedMetadataBuf, body],
                {type: data.type});

            // add existing file info
            this.addFileInfo(result, timestamp);

            // store result
            this.player().convertedData = result;

            // notify listeners
            this.player().trigger('finishConvert');
        });
    }
}

// expose plugin
videojs.TsEBMLEngine = TsEBMLEngine;

export default TsEBMLEngine;
