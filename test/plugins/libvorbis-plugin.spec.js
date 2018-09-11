/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers.js';

// registers the plugin
import LibVorbisEngine from '../../src/js/plugins/libvorbis-plugin.js';
import {LIBVORBISJS} from '../../src/js/engine/record-engine.js';


/** @test {LibVorbisEngine} */
describe('plugins.libvorbis-plugin', () => {
    var player;

    afterEach(() => {
        player.dispose();
    });

    /** @test {LibVorbisEngine} */
    it('can run as an audio-only plugin', (done) => {
        // create audio-only player with libvorbis.js plugin
        player = TestHelpers.makeAudioOnlyPluginPlayer(LIBVORBISJS);

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
