/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers.js';

// registers the plugin
import OpusRecorderEngine from '../../src/js/plugins/opus-recorder-plugin.js';
import {OPUSRECORDER} from '../../src/js/engine/record-engine.js';


/** @test {OpusRecorderEngine} */
describe('plugins.opus-recorder-plugin', () => {
    var player;

    afterEach(() => {
        player.dispose();
    });

    /** @test {OpusRecorderEngine} */
    it('can run as an audio-only plugin', (done) => {
        // create audio-only player with opus-recorder plugin
        player = TestHelpers.makeAudioOnlyPluginPlayer(OPUSRECORDER);

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
            }, 2000);
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
});
