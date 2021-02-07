import TestHelpers from './test-helpers';

import keycode from 'keycode';

import Event from '../src/js/event';
import defaultKeyHandler from '../src/js/hot-keys';

const mockKeyDownEvent = (key) => {
    return {
        preventDefault() {},
        stopPropagation() {},
        type: 'keydown',
        which: keycode.codes[key]
    };
};

/** @test {hot-keys} */
describe('hot-keys.defaultKeyHandler', () => {
    let player;

    afterEach(() => {
        player.dispose();
    });

    it('hotkeys are disabled by default', (done) => {
        player = TestHelpers.makeAudioOnlyPlayer();
        player.one(Event.READY, () => {
            expect(player.options_.userActions).toBeUndefined();
            done();
        });
    });

    it('when hotkeys is true, hotkeys are enabled', (done) => {
        player = TestHelpers.makeAudioOnlyPlayer({
            plugins: {
                record: {
                    pip: true,
                    hotKeys: true
                }
            }
        });

        player.one(Event.FINISH_RECORD, () => {
            // toggle PiP
            player.handleKeyDown(mockKeyDownEvent('p'));

            // wait till it's loaded before destroying
            // (XXX: create new event for this)
            setTimeout(done, 1000);
        });

        player.one(Event.DEVICE_READY, () => {
            // start recording using default hotkey
            player.handleKeyDown(mockKeyDownEvent('x'));

            // stop recording using hotkey after few seconds
            setTimeout(() => {
                player.handleKeyDown(mockKeyDownEvent('x'));
            }, 2000);
        });

        player.one(Event.READY, () => {
            expect(player.options_.userActions.hotkeys).toEqual(defaultKeyHandler);

            player.record().getDevice();
        });
    });

    it('when hotkeys is an object, hotkeys are enabled', (done) => {
        const keyHandler = (event) => {};
        player = TestHelpers.makeAudioOnlyPlayer({
            plugins: {
                record: {
                    hotKeys: keyHandler
                }
            }
        });
        player.one(Event.READY, () => {
            expect(player.options_.userActions.hotkeys).toEqual(keyHandler);
            done();
        });
    });
});
