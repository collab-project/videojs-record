/**
 * @since 3.5.0
 */

import TestHelpers from '../test-helpers';

import Event from '../../src/js/event';

// registers the plugin
import {RecordRTCEngine} from '../../src/js/engine/record-rtc';
import WebmWasmEngine from '../../src/js/plugins/webm-wasm-plugin';
import {WEBMWASM} from '../../src/js/engine/record-engine';


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

        player.one(Event.FINISH_RECORD, () => {
            // received a blob file
            expect(player.recordedData instanceof Blob).toBeTruthy();
            expect(player.recordedData.name).toEndWith('.webm');

            // wait till it's loaded before destroying
            // (XXX: create new event for this)
            setTimeout(done, 1000);
        });

        player.one(Event.START_RECORD, () => {
            // stop recording after few seconds
            setTimeout(() => {
                player.record().stop();
            }, 4000);
        });

        player.one(Event.DEVICE_READY, () => {
            // record some video
            player.record().start();
        });

        player.one(Event.READY, () => {
            // start device
            player.record().getDevice();
        });
    });
});
