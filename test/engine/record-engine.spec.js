/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers.js';

import RecordEngine from '../../src/js/engine/record-engine';
import {RECORDRTC, LIBVORBISJS, RECORDERJS, LAMEJS, OPUSRECORDER, RecordEngine} from '../../src/js/engine/record-engine';


/** @test {record-engine} */
describe('engine.record-engine', function() {
    var player;

    beforeEach(function() {
        // cleanup all players
        TestHelpers.cleanup();

        // create new player
        player = TestHelpers.makePlayer();
    });

    it('should create the correct component', function() {
        let engine = new RecordEngine(player, {});

        expect(engine.on).toBeFunction();
        
        // should auto mixin the evented mixin (required since video.js v6.6.0)
        expect(engine.options_.evented).toBeTrue();
    });

    it('should contain supported recorder plugin engines', function() {
        expect(RECORDRTC).toEqual('recordrtc');
        expect(LIBVORBISJS).toEqual('libvorbis.js');
        expect(RECORDERJS).toEqual('recorder.js');
        expect(LAMEJS).toEqual('lamejs');
        expect(OPUSRECORDER).toEqual('opus-recorder');
    });

    it('should trigger recordComplete event', function(done) {
        let engine = new RecordEngine(player, {});
        engine.on('recordComplete', function() {
            done();
        })

        let data = {};
        engine.onStopRecording(data);
    });
    

});