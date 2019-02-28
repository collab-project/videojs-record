/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers.js';

import Event from '../../src/js/event.js';
import {RECORDRTC, LIBVORBISJS, RECORDERJS, LAMEJS, OPUSRECORDER, VMSG, WEBMWASM, RECORD_PLUGINS, AUDIO_PLUGINS, VIDEO_PLUGINS, RecordEngine} from '../../src/js/engine/record-engine.js';


/** @test {record-engine} */
describe('engine.record-engine', () => {
    let player;

    beforeEach(() => {
        // create new player
        player = TestHelpers.makePlayer();
    });

    afterEach(() => {
        player.dispose();
    });

    it('create the correct component', () => {
        let engine = new RecordEngine(player, {});

        expect(engine.on).toBeFunction();

        // should auto mixin the evented mixin (required since video.js v6.6.0)
        expect(engine.options_.evented).toBeTrue();
    });

    it('contain supported recorder plugin engines', () => {
        // builtin
        expect(RECORDRTC).toEqual('recordrtc');

        // audio
        expect(LIBVORBISJS).toEqual('libvorbis.js');
        expect(RECORDERJS).toEqual('recorder.js');
        expect(LAMEJS).toEqual('lamejs');
        expect(OPUSRECORDER).toEqual('opus-recorder');
        expect(VMSG).toEqual('vmsg');
        expect(AUDIO_PLUGINS.length).toEqual(5);

        // video
        expect(WEBMWASM).toEqual('webm-wasm');
        expect(VIDEO_PLUGINS.length).toEqual(1);

        // all
        expect(RECORD_PLUGINS.length).toEqual(6);
    });

    it('trigger recordComplete event', (done) => {
        let engine = new RecordEngine(player, {});
        engine.on(Event.RECORD_COMPLETE, () => {
            done();
        });

        let data = {};
        engine.onStopRecording(data);
    });

    it('add file info', (done) => {
        let engine = new RecordEngine(player, {});
        engine.on(Event.RECORD_COMPLETE, () => {
            let fileName = engine.recordedData.lastModified + '.ogg';
            expect(engine.recordedData.name).toEqual(fileName);

            done();
        });

        let req = new Request(TestHelpers.TEST_OGG);
        fetch(req).then((response) => {
            return response.blob();
        }).then((blob) => {
            engine.onStopRecording(blob);
        });
    });

    it('save as', (done) => {
        let engine = new RecordEngine(player, {});
        engine.on(Event.RECORD_COMPLETE, () => {
            let fileName = 'foo';
            engine.saveAs({'audio': fileName});

            // ignore edge browser
            if (typeof navigator.msSaveOrOpenBlob === 'undefined') {
                let element = document.getElementsByTagName('a')[0];
                expect(element.download).toEqual(fileName);
            }
            done();
        });

        let req = new Request(TestHelpers.TEST_OGG);
        fetch(req).then((response) => {
            return response.blob();
        }).then((blob) => {
            engine.onStopRecording(blob);
        });
    });
});