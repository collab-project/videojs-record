/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers.js';

// registers the plugin
import OpusRecorderEngine from '../../src/js/plugins/opus-recorder-plugin.js';
import {OPUSRECORDER} from '../../src/js/engine/record-engine.js';


/** @test {OpusRecorderEngine} */
describe('plugins.opus-recorder-plugin', function() {
    var player;

    afterEach(function() {
        player.dispose();
    });

    /** @test {OpusRecorderEngine} */
    it('should run as an audio-only plugin', function(done) {
        // create audio-only player with opus-recorder plugin
        player = TestHelpers.makeAudioOnlyPluginPlayer(OPUSRECORDER);

        player.one('finishRecord', function() {
            // received a blob file
            expect(player.recordedData instanceof Blob).toBeTruthy();

            // wait till it's loaded before destroying
            // (XXX: create new event for this)
            setTimeout(done, 1000);
        });

        player.one('startRecord', function() {
            // stop recording after few seconds
            setTimeout(function() {
                player.record().stop();
            }, 2000);
        });

        player.one('deviceReady', function() {
            // record some audio
            player.record().start();
        });

        player.one('ready', function() {
            // start device
            player.record().getDevice();
        });
    });
});
