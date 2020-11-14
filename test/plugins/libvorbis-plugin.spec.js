/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers';

import Event from '../../src/js/event';

// registers the plugin
import LibVorbisEngine from '../../src/js/plugins/libvorbis-plugin';
import {LIBVORBISJS} from '../../src/js/engine/record-engine';


/** @test {LibVorbisEngine} */
describe('plugins.libvorbis-plugin', () => {
    let player;

    afterEach(() => {
        player.dispose();
    });

    /** @test {LibVorbisEngine} */
    it('can run as an audio-only plugin', (done) => {
        // create audio-only player with libvorbis.js plugin
        player = TestHelpers.makeAudioOnlyPluginPlayer(LIBVORBISJS);

        player.one(Event.FINISH_RECORD, () => {
            // received a blob file
            expect(player.recordedData instanceof Blob).toBeTruthy();
            expect(player.recordedData.name).toEndWith('.oga');

            // wait till it's loaded before destroying
            // (XXX: create new event for this)
            setTimeout(done, 1000);
        });

        player.one(Event.START_RECORD, () => {
            // stop recording after few seconds
            setTimeout(() => {
                player.record().stop();
            }, 2000);
        });

        player.one(Event.DEVICE_READY, () => {
            // record some audio
            player.record().start();
        });

        player.one(Event.READY, () => {
            // start device
            player.record().getDevice();
        });
    });
});
