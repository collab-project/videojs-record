/**
 * @since 3.5.0
 */

import TestHelpers from '../test-helpers.js';

import Event from '../../src/js/event.js';

// registers the plugin
import {RecordRTCEngine} from '../../src/js/engine/record-rtc.js';
import WebmWasmEngine from '../../src/js/plugins/webm-wasm-plugin.js';
import {WEBMWASM} from '../../src/js/engine/record-engine.js';


/** @test {WebmWasmEngine} */
describe('plugins.webm-wasm-plugin', () => {
    let player;

    afterEach(() => {
        player.dispose();
    });

    /** @test {WebmWasmEngine} */
    it('can run as a video-only plugin', (done) => {
        // create video-only player with webm-wasm plugin
        player = TestHelpers.makeVideoOnlyPluginPlayer(WEBMWASM);

        player.one(Event.FINISHRECORD, () => {
            // received a blob file
            expect(player.recordedData instanceof Blob).toBeTruthy();

            // wait till it's loaded before destroying
            // (XXX: create new event for this)
            setTimeout(done, 1000);
        });

        player.one(Event.STARTRECORD, () => {
            // stop recording after few seconds
            setTimeout(() => {
                player.record().stop();
            }, 4000);
        });

        player.one(Event.DEVICEREADY, () => {
            // record some audio
            player.record().start();
        });

        player.one(Event.READY, () => {
            // start device
            player.record().getDevice();
        });
    });
});
