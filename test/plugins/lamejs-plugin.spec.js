/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers.js';

// registers the plugin
import LamejsEngine from '../../src/js/plugins/lamejs-plugin.js';
import {LAMEJS} from '../../src/js/engine/record-engine.js';


/** @test {LamejsEngine} */
describe('plugins.lamejs-plugin', function() {
    var player;

    afterEach(function() {
        player.dispose();
    });

    /** @test {LamejsEngine} */
    it('should run as an audio-only plugin', function(done) {
        // create audio-only player with lamejs plugin
        player = TestHelpers.makeAudioOnlyPluginPlayer(LAMEJS);

        player.one('finishRecord', function() {
            // received a blob file
            expect(player.recordedData instanceof Blob).toBeTruthy();

            // wait till it's loaded before destroying
            // (XXX: create new event for this)
            setTimeout(done, 1000);
        });

        player.one('startRecord', function() {
            // record some audio
            setTimeout(function() {
                // stop
                player.record().stop();
            }, 2000);
        });

        player.one('deviceReady', function() {
            // create snapshot
            player.record().start();
        });

        player.one('ready', function() {
            // start device
            player.record().getDevice();
        });
    });
});
