/**
 * @file ts-ebml-plugin.js
 * @since 3.3.0
 */

//import {Decoder, Encoder, tools, Reader} from 'ts-ebml';
import {readAsArrayBuffer} from '../utils/file-util';

const ConvertEngine = videojs.getComponent('ConvertEngine');

/**
 * Converter engine using the ts-ebml library.
 *
 * @class
 * @augments videojs.ConvertEngine
 */
class TsEBMLEngine extends ConvertEngine {

    injectMetadata(data) {
        const decoder = new Decoder();
        const reader = new Reader();

        reader.logging = false;
        reader.drop_default_duration = false;

        readAsArrayBuffer(data).then((buffer) => {
            const elms = decoder.decode(buffer);
            elms.forEach((elm) => { reader.read(elm); });
            reader.stop();

            let refinedMetadataBuf = tools.makeMetadataSeekable(
                reader.metadatas, reader.duration, reader.cues);
            let body = buffer.slice(reader.metadataSize);
            let result = new Blob([refinedMetadataBuf, body],
                {type: data.type});

            // console.log('ready', result);

            data = result;
        });
    }
}

// expose plugin
videojs.TsEBMLEngine = TsEBMLEngine;

export default TsEBMLEngine;
