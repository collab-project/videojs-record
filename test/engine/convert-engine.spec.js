/**
 * @since 3.3.0
 */

import TestHelpers from '../test-helpers';

import {ConvertEngine, CONVERT_PLUGINS, TSEBML, FFMPEGJS} from '../../src/js/engine/convert-engine';


/** @test {convert-engine} */
describe('engine.convert-engine', () => {
    let player;

    beforeEach(() => {
        // create new player
        player = TestHelpers.makePlayer();
    });

    afterEach(() => {
        player.dispose();
    });

    it('create the correct component', () => {
        let engine = new ConvertEngine(player, {});

        expect(engine.on).toBeFunction();

        // should auto mixin the evented mixin (required since video.js v6.6.0)
        expect(engine.options_.evented).toBeTrue();
    });

    it('contain supported convert plugin engines', () => {
        expect(TSEBML).toEqual('ts-ebml');
        expect(FFMPEGJS).toEqual('ffmpeg.js');
        expect(CONVERT_PLUGINS.length).toEqual(2);
    });

    it('loads blob', (done) => {
        let engine = new ConvertEngine(player, {});
        let req = new Request(TestHelpers.TEST_OGG);

        fetch(req).then((response) => {
            return response.blob();
        }).then((blob) => {
            engine.loadBlob(blob).then((buffer) => {
                // received an arraybuffer
                expect(buffer instanceof ArrayBuffer).toBeTruthy();
                done();
            });
        });
    });

    it('adds file info', (done) => {
        let engine = new ConvertEngine(player, {});
        let req = new Request(TestHelpers.TEST_OGG);

        fetch(req).then((response) => {
            return response.blob();
        }).then((blob) => {
            engine.addFileInfo(blob);
            done();
        });
    });
});
