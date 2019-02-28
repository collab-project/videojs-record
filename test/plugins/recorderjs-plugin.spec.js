/**
 * @since 2.2.0
 */

import TestHelpers from '../test-helpers.js';

import Event from '../../src/js/event.js';

// registers the plugin
import RecorderjsEngine from '../../src/js/plugins/recorderjs-plugin.js';
import {RECORDERJS} from '../../src/js/engine/record-engine.js';


/** @test {RecorderjsEngine} */
describe('plugins.recorderjs-plugin', () => {
    let player;
    let originalTimeout;

    beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

        // create audio-only player with recorderjs plugin
        player = TestHelpers.makeAudioOnlyPluginPlayer(RECORDERJS);
    });

    afterEach(() => {
        player.dispose();

        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    /** @test {RecorderjsEngine} */
    it('can run as an audio-only plugin', (done) => {
        player.one(Event.DEVICE_READY, () => {
            setTimeout(() => {
                done();
            }, 2000);
        });

        player.one(Event.READY, () => {
            // start device
            player.record().getDevice();
        });
    });
});
