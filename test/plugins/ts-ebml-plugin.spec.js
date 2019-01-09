/**
 * @since 3.3.0
 */

import TestHelpers from '../test-helpers.js';

// registers the plugin
import TsEBMLEngine from '../../src/js/plugins/ts-ebml-plugin.js';
import {TSEBML} from '../../src/js/engine/convert-engine.js';


/** @test {TsEBMLEngine} */
describe('plugins.ts-ebml-plugin', () => {
    let player;

    beforeEach(() => {
        // create video-only player with ts-ebml plugin
        player = TestHelpers.makeConvertPluginPlayer(TSEBML);
    });

    afterEach(() => {
        player.dispose();
    });

    /** @test {TsEBMLEngine} */
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
