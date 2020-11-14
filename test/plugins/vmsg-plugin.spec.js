/**
 * @since 3.3.0
 */

import TestHelpers from '../test-helpers';

import Event from '../../src/js/event';

// registers the plugin
import VmsgEngine from '../../src/js/plugins/vmsg-plugin';
import {VMSG} from '../../src/js/engine/record-engine';


/** @test {VmsgEngine} */
describe('plugins.vmsg-plugin', () => {
    let player;

    afterEach(() => {
        player.dispose();
    });

    /** @test {VmsgEngine} */
    it('can run as an audio-only plugin', (done) => {
        // allow test to fail
        pending('disabled until test runner failure is figured out');

        // create audio-only player with vmsg plugin
        player = TestHelpers.makeAudioOnlyPluginPlayer(VMSG);

        player.one(Event.FINISH_CONVERT, () => {
            // received a blob file
            expect(player.recordedData instanceof Blob).toBeTruthy();
            expect(player.recordedData.name).toEndWith('.mp3');

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
            // record some audio
            player.record().start();
        });

        player.one(Event.READY, () => {
            // start device
            player.record().getDevice();
        });
    });
});
