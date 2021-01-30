/**
 * @since 4.2.0
 */

import TestHelpers from '../test-helpers';

import Event from '../../src/js/event';

// registers the plugin
import OpusMediaRecorderEngine from '../../src/js/plugins/opus-media-recorder-plugin';
import {OPUSMEDIARECORDER} from '../../src/js/engine/record-engine';


/** @test {OpusMediaRecorderEngine} */
describe('plugins.opus-media-recorder-plugin', () => {
    let player;

    afterEach(() => {
        player.dispose();
    });

    /** @test {OpusMediaRecorderEngine} */
    it('can run as an audio-only plugin', (done) => {
        // allow test to fail
        pending('disabled until test runner failure is figured out');

        // create audio-only player with opus-media-recorder plugin
        player = TestHelpers.makeAudioOnlyPluginPlayer(OPUSMEDIARECORDER);

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
