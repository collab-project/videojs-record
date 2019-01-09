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
    it('can run', (done) => {
        player.one('deviceReady', () => {
            setTimeout(() => {
                done();
            }, 2000);
        });

        player.one('ready', () => {
            // start device
            player.record().getDevice();
        });
    });
});
