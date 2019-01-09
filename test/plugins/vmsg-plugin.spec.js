/**
 * @since 3.3.0
 */

import TestHelpers from '../test-helpers.js';

// registers the plugin
import VmsgEngine from '../../src/js/plugins/vmsg-plugin.js';
import {VMSG} from '../../src/js/engine/record-engine.js';


/** @test {VmsgEngine} */
describe('plugins.vmsg-plugin', () => {
    let player;

    afterEach(() => {
        player.dispose();
    });

    /** @test {VmsgEngine} */
    /*
    it('can run as an audio-only plugin', (done) => {
        // create audio-only player with vmsg plugin
        player = TestHelpers.makeAudioOnlyPluginPlayer(VMSG);

        player.one('finishRecord', () => {
            // received a blob file
            expect(player.recordedData instanceof Blob).toBeTruthy();

            // wait till it's loaded before destroying
            // (XXX: create new event for this)
            setTimeout(done, 1000);
        });

        player.one('startRecord', () => {
            // stop recording after few seconds
            setTimeout(() => {
                player.record().stop();
            }, 4000);
        });

        player.one('deviceReady', () => {
            // record some audio
            player.record().start();
        });

        player.one('ready', () => {
            // start device
            player.record().getDevice();
        });
    });
    */
});
