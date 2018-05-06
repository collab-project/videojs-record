/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers.js';

// registers the plugin
import RecorderjsEngine from '../../src/js/plugins/recorderjs-plugin.js';
import {RECORDERJS} from '../../src/js/engine/record-engine.js';


/** @test {RecorderjsEngine} */
describe('plugins.recorderjs-plugin', function() {
    var player;
    var originalTimeout;

    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

        // create audio-only player with recorderjs plugin
        player = TestHelpers.makeAudioOnlyPluginPlayer(RECORDERJS);
    });

    afterEach(function() {
        player.dispose();

        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    /** @test {RecorderjsEngine} */
    it('should run as an audio-only plugin', function(done) {

        player.one('deviceReady', function() {
            setTimeout(function() {
                done();
            }, 2000);
        });

        player.one('ready', function() {
            // start device
            player.record().getDevice();
        });
    });
});
