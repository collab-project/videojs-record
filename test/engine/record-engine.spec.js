/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers.js';

import {RECORDRTC, LIBVORBISJS, RECORDERJS, LAMEJS, OPUSRECORDER, RecordEngine} from '../../src/js/engine/record-engine.js';


/** @test {record-engine} */
describe('engine.record-engine', function() {
    var player;

    beforeEach(function() {
        // create new player
        player = TestHelpers.makePlayer();
    });

    afterEach(function() {
        player.dispose();
    });

    it('create the correct component', function() {
        let engine = new RecordEngine(player, {});

        expect(engine.on).toBeFunction();

        // should auto mixin the evented mixin (required since video.js v6.6.0)
        expect(engine.options_.evented).toBeTrue();
    });

    it('contain supported recorder plugin engines', function() {
        expect(RECORDRTC).toEqual('recordrtc');
        expect(LIBVORBISJS).toEqual('libvorbis.js');
        expect(RECORDERJS).toEqual('recorder.js');
        expect(LAMEJS).toEqual('lamejs');
        expect(OPUSRECORDER).toEqual('opus-recorder');
    });

    it('trigger recordComplete event', function(done) {
        let engine = new RecordEngine(player, {});
        engine.on('recordComplete', function() {
            done();
        })

        let data = {};
        engine.onStopRecording(data);
    });

    it('add file info', function(done) {
        let engine = new RecordEngine(player, {});
        engine.on('recordComplete', function() {
            expect(engine.recordedData.name).toEqual(
                   engine.recordedData.lastModified + '.ogg');
            done();
        })

        let req = new Request(TestHelpers.TEST_OGG);
        fetch(req).then(function(response) {
            return response.blob();
        }).then(function(blob){
            engine.onStopRecording(blob);
        });
    });

    it('save as', function(done) {
        let engine = new RecordEngine(player, {});
        engine.on('recordComplete', function() {
            let fileName = 'foo';
            engine.saveAs({'audio': fileName});

            let element = document.getElementsByTagName('a')[0];
            expect(element.download).toEqual(fileName);
            done();
        })

        let req = new Request(TestHelpers.TEST_OGG);
        fetch(req).then(function(response) {
            return response.blob();
        }).then(function(blob){
            engine.onStopRecording(blob);
        });
    });
});