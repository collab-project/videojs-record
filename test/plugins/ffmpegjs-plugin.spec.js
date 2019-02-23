/**
 * @since x.x.x
 */

import TestHelpers from '../test-helpers.js';

// registers the plugin
import FFmpegjsEngine from '../../src/js/plugins/ffmpegjs-plugin.js';
import {FFMPEGJS} from '../../src/js/engine/convert-engine.js';

/** @test {FFmpegjsEngine} */
describe('plugins.ffmpegjs-plugin', () => {
    let player;

    beforeEach(() => {
        // create video-only player with ffmpeg.js plugin
        player = TestHelpers.makeConvertPluginPlayer(FFMPEGJS);
    });

    afterEach(() => {
        player.dispose();
    });

    /** @test {FFmpegjsEngine} */
    it('converts', (done) => {
        player.one('deviceReady', () => {
            let req = new Request(TestHelpers.TEST_WEBM);
            fetch(req).then((response) => {
                return response.blob();
            }).then((blob) => {
                player.one('finishConvert', () => {
                    expect(player.convertedData instanceof Blob).toBeTruthy();
                    done();
                });
                player.record().converter.convert(blob);
            });
        });

        player.one('ready', () => {
            // start device
            player.record().getDevice();
        });
    });
});
