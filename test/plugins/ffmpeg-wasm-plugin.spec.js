/**
 * @since 4.2.0
 */

import TestHelpers from '../test-helpers';

// registers the plugin
import FFmpegWasmEngine from '../../src/js/plugins/ffmpegjs-plugin';
import {FFMPEGWASM} from '../../src/js/engine/convert-engine';

/** @test {FFmpegWasmEngine} */
describe('plugins.ffmpeg-wasm-plugin', () => {
    let player;

    beforeEach(() => {
        // create video-only player with ffmpeg.wasm plugin
        player = TestHelpers.makeConvertPluginPlayer(FFMPEGWASM);
    });

    afterEach(() => {
        player.dispose();
    });

    /** @test {FFmpegWasmEngine} */
    it('converts', (done) => {
        // allow test to fail
        pending('disabled until test runner failure is figured out');

        player.one('deviceReady', () => {
            let req = new Request(TestHelpers.TEST_WEBM);
            fetch(req).then((response) => {
                return response.blob();
            }).then((blob) => {
                player.one('finishConvert', () => {
                    expect(player.convertedData instanceof Blob).toBeTruthy();
                    expect(player.convertedData.name).toEndWith('.mp4');
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
