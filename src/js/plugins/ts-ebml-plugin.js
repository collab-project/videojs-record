/**
 * @file ts-ebml-plugin.js
 * @since 3.3.0
 */

//import {Decoder, Encoder, tools, Reader} from 'ts-ebml';

const ConvertEngine = videojs.getComponent('ConvertEngine');

/**
 * Converter engine using the ts-ebml library.
 *
 * @class
 * @augments videojs.ConvertEngine
 */
class TsEBMLEngine extends ConvertEngine {
	readAsArrayBuffer(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(blob);
            reader.onloadend = () => { resolve(reader.result); };
            reader.onerror = (ev) => { reject(ev.error); };
        });
    }

    injectMetadata() {
        const decoder = new Decoder();
        const reader = new Reader();

        reader.logging = false;
        reader.drop_default_duration = false;

        this.readAsArrayBuffer(this.player.recordedData).then((buffer) => {
            const elms = decoder.decode(buffer);
            elms.forEach((elm) => { reader.read(elm); });
            reader.stop();

            let refinedMetadataBuf = tools.makeMetadataSeekable(
                reader.metadatas, reader.duration, reader.cues);
            let body = buffer.slice(reader.metadataSize);
            let result = new Blob([refinedMetadataBuf, body],
                {type: this.player.recordedData.type});

            // console.log('ready', result);

            this.player.recordedData = result;
        });
    }
}

// expose plugin
videojs.TsEBMLEngine = TsEBMLEngine;

export default TsEBMLEngine;
