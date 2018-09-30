/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers.js';

import {RECORDRTC, LIBVORBISJS, RECORDERJS, LAMEJS, OPUSRECORDER, RecordEngine} from '../../src/js/engine/record-engine.js';


/** @test {record-engine} */
describe('engine.record-engine', () => {
    var player;

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
        expect(RECORDRTC).toEqual('recordrtc');
        expect(LIBVORBISJS).toEqual('libvorbis.js');
        expect(RECORDERJS).toEqual('recorder.js');
        expect(LAMEJS).toEqual('lamejs');
        expect(OPUSRECORDER).toEqual('opus-recorder');
    });

    it('trigger recordComplete event', (done) => {
        let engine = new RecordEngine(player, {});
        engine.on('recordComplete', () => {
            done();
        });

        let data = {};
        engine.onStopRecording(data);
    });

    it('add file info', (done) => {
        let engine = new RecordEngine(player, {});
        engine.on('recordComplete', () => {
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
        engine.on('recordComplete', () => {
            let fileName = 'foo';
            engine.saveAs({'audio': fileName});

            let element = document.getElementsByTagName('a')[0];
            expect(element.download).toEqual(fileName);
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