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

    afterEach(function() {
        player.dispose();
    });

    /** @test {RecorderjsEngine} */
    it('should run as an audio-only plugin', function(done) {
        // create audio-only player with recorderjs plugin
        player = TestHelpers.makeAudioOnlyPluginPlayer(RECORDERJS);

        player.one('ready', function() {
            // the recorderjs library is hard to test (and unmaintained),
            // so leave it at this
            done();
        });
    });
});
