/**
 * @since 2.2.0
 */

import TestHelpers from './test-helpers.js';

import Event from '../src/js/event.js';
import {isFirefox, detectBrowser} from '../src/js/utils/detect-browser.js';

// registers the plugin
import Record from '../src/js/videojs.record.js';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

const isScreenCompatible = (browser) => (
    isFirefox() ||
    (browser.browser === 'chrome' && browser.version >= 72) ||
    browser.browser === 'edge'
);

/** @test {Record} */
describe('Record', () => {
    let player;

    afterEach(() => {
        try {
            player.dispose();
        } catch (err) {}
    });

    /** @test {Record} */
    it('advanced plugin instance', (done) => {
        // create new player
        player = TestHelpers.makePlayer();

        player.one(Event.READY, () => {
            expect(player.el().nodeName).toEqual('DIV');
            expect(player.hasClass('vjs-record')).toBeTrue();
            expect(player.on).toBeFunction();

            // plugins exist
            expect(videojs.getPlugin('wavesurfer')).toBeFunction();
            expect(videojs.getPlugin('record')).toBeFunction();

            // plugin version number is correct
            let version = require('../package.json').version;
            expect(videojs.getPluginVersion('record')).toEqual(version);

            // correct device button icon
            expect(player.deviceButton.buildCSSClass()).toEndWith(
                'audio-perm');
            done();
        });
    });

    /** @test {Record} */
    it('runs as video-only plugin', (done) => {
        // create video-only plugin
        player = TestHelpers.makeVideoOnlyPlayer();

        player.one(Event.FINISH_RECORD, () => {
            // received a blob file
            expect(player.recordedData instanceof Blob).toBeTruthy();

            // wait till it's loaded before destroying
            // (XXX: create new event for this)
            setTimeout(done, 1000);
        });

        player.one(Event.DEVICE_READY, () => {
            // start recording for few seconds
            player.record().start();
            setTimeout(() => {
                // stop recording
                player.record().stop();
            }, 2000);
        });

        player.one(Event.READY, () => {
            // correct device button icon
            expect(player.deviceButton.buildCSSClass().endsWith(
                'video-perm')).toBeTrue();

            // start device
            player.record().getDevice();
        });
    });

    /** @test {Record} */
    it('runs as image-only plugin', (done) => {
        // create image-only plugin
        player = TestHelpers.makeImageOnlyPlayer();
        // XXX: workaround weird error during test
        // TypeError: Cannot read property 'videoWidth' of null tech error
        player.recordCanvas.el().firstChild.videoWidth = 320;
        player.recordCanvas.el().firstChild.videoHeight = 240;

        player.one(Event.FINISH_RECORD, () => {
            // received a base-64 encoded PNG string
            expect(player.recordedData.startsWith(
                'data:image/png;base64,i')).toBeTrue();

            setTimeout(() => {
                done();
            }, 2000);
        });

        player.one(Event.DEVICE_READY, () => {
            // create snapshot
            player.record().start();
        });

        player.one(Event.READY, () => {
            // correct device button icon
            expect(player.deviceButton.buildCSSClass().endsWith(
                'video-perm')).toBeTrue();

            // start device
            player.record().getDevice();
        });
    });

    /** @test {Record} */
    it('change image output from dataURL to blob', (done) => {
        // create new player
        let opts = {
            plugins: {
                record: {
                    imageOutputType: 'blob',
                }
            }
        };

        player = TestHelpers.makeImageOnlyPlayer(opts);

        player.recordCanvas.el().firstChild.videoWidth = 320;
        player.recordCanvas.el().firstChild.videoHeight = 240;

        expect(player.record().imageOutputType).toEqual('blob');

        player.one(Event.FINISH_RECORD, () => {
            expect(player.recordedData instanceof Blob).toBeTruthy();

            setTimeout(done, 2000);
        });

        player.one(Event.DEVICE_READY, () => {
            // create snapshot
            player.record().start();
        });

        player.one(Event.READY, () => {
            // correct device button icon
            expect(player.deviceButton.buildCSSClass().endsWith(
                'video-perm')).toBeTrue();

            // start device
            player.record().getDevice();
        });
    });

    /** @test {Record} */
    it('runs as audio-only plugin', (done) => {
        // create audio-only plugin
        player = TestHelpers.makeAudioOnlyPlayer();

        player.one(Event.FINISH_RECORD, () => {
            // received a blob file
            expect(player.recordedData instanceof Blob).toBeTruthy();

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
            // correct device button icon
            expect(player.deviceButton.buildCSSClass().endsWith(
                'audio-perm')).toBeTrue();

            // start device
            player.record().getDevice();
        });
    });

    /** @test {Record} */
    it('runs as audio-video plugin', (done) => {
        // create audio-video plugin
        player = TestHelpers.makeAudioVideoPlayer();

        player.one(Event.FINISH_RECORD, () => {
            let data = player.recordedData;
            expect(data instanceof Blob).toBeTruthy();

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
            // record some audio+video
            player.record().start();
        });

        player.one(Event.READY, () => {
            // correct device button icon
            expect(player.deviceButton.buildCSSClass().endsWith(
                'av-perm')).toBeTrue();

            // start device
            player.record().getDevice();
        });
    });

    /** @test {Record} */
    it('runs as audio-screen plugin', (done) => {
        // create audio-screen plugin
        player = TestHelpers.makeAudioScreenPlayer();

        // correct device button icon
        expect(player.deviceButton.buildCSSClass().endsWith(
            'sv-perm')).toBeTrue();

        if (isScreenCompatible(detectBrowser())) {
            player.one(Event.FINISH_RECORD, () => {
                let data = player.recordedData;
                expect(data instanceof Blob).toBeTruthy();

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
                // record some audio+video
                player.record().start();
            });

            player.one(Event.READY, () => {
                // start device
                player.record().getDevice();
            });
        } else {
            done();
        }
    });

    /** @test {Record} */
    it('runs as screen-only plugin', (done) => {
        // create screen-only plugin
        player = TestHelpers.makeScreenOnlyPlayer();
        // correct device button icon
        expect(player.deviceButton.buildCSSClass().endsWith(
            'screen-perm')).toBeTrue();

        if (isScreenCompatible(detectBrowser())) {
            player.one(Event.FINISH_RECORD, () => {
                // received a blob file
                expect(player.recordedData instanceof Blob).toBeTruthy();

                // wait till it's loaded before destroying
                // (XXX: create new event for this)
                setTimeout(done, 1000);
            });

            player.one(Event.DEVICE_READY, () => {
                // start recording for few seconds
                player.record().start();

                setTimeout(() => {
                    // stop recording
                    player.record().stop();
                }, 2000);
            });

            player.one(Event.READY, () => {
                // start device
                player.record().getDevice();
            });
        } else {
            done();
        }
    });

    /** @test {Record#destroy} */
    it('destroys', (done) => {
        // create new player
        player = TestHelpers.makePlayer();

        player.one(Event.READY, () => {
            expect(player.record().isDestroyed()).toBeFalse();
            player.record().destroy();

            done();
        });
    });

    /** @test {Record#reset} */
    it('resets', (done) => {
        // create new player
        player = TestHelpers.makePlayer();

        player.one(Event.READY, () => {
            // reset
            player.record().reset();

            expect(player.record().getDuration()).toEqual(0);
            expect(player.record().getCurrentTime()).toEqual(0);
            done();
        });
    });

    /** @test {Record#enumerateDevices} */
    it('enumerates devices', (done) => {
        // create new player
        player = TestHelpers.makePlayer();

        player.one(Event.ENUMERATE_READY, () => {
            expect(player.record().devices).toBeNonEmptyArray();
            done();
        });

        player.one(Event.READY, () => {
            player.record().enumerateDevices();
        });
    });

    /** @test {Record#autoMuteDevice} */
    it('accepts the autoMuteDevice setting', (done) => {
        // create new player
        player = TestHelpers.makeAudioVideoPlayer({
            plugins: {
                record: {
                    autoMuteDevice: true
                }
            }
        });

        player.one(Event.FINISH_RECORD, () => {
            let browser = detectBrowser();
            if (isFirefox() || (browser.browser === 'chrome' && browser.version >= 70)) {
                expect(player.record().stream.getVideoTracks()[0].enabled).toBeFalse();
                expect(player.record().stream.getAudioTracks()[0].enabled).toBeFalse();
            }
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
            // record some
            player.record().start();
        });

        player.one(Event.READY, () => {
            player.record().getDevice();
        });
    });

    /** @test {Record#setAudioOutput} */
    it('can set audio output', (done) => {
        // create new audio player
        player = TestHelpers.makeAudioOnlyPlayer();

        player.one(Event.ERROR, (e) => {
            expect(e.type).toEqual(Event.ERROR);

            done();
        });

        player.one(Event.ENUMERATE_READY, () => {
            player.record().setAudioOutput('fakeId');
        });

        player.one(Event.READY, () => {
            player.record().enumerateDevices();
        });
    });

    /** @test {Record#saveAs} */
    it('saves as', (done) => {
        // create new player
        player = TestHelpers.makePlayer();

        player.one(Event.FINISH_RECORD, () => {
            player.record().saveAs({'video': 'name-of-video-file'});

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
            // record some
            player.record().start();
        });

        player.one(Event.READY, () => {
            // start device
            player.record().getDevice();
        });
    });

    /** @test {Record#getDuration} */
    it('can get duration and current time', (done) => {
        // create new player
        player = TestHelpers.makePlayer();

        player.one(Event.FINISH_RECORD, () => {
            expect(player.record().getDuration()).toBeWithinRange(1.5, 2.5);
            expect(player.record().getCurrentTime()).toEqual(0);

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
            expect(player.record().getDuration()).toEqual(0);
            expect(player.record().getCurrentTime()).toEqual(0);

            // record some
            player.record().start();
        });

        player.one(Event.READY, () => {
            // start device
            player.record().getDevice();
        });
    });

    /** @test {Record#pause} */
    it('pauses and resumes recording', (done) => {
        // create new player
        player = TestHelpers.makePlayer();

        player.one(Event.FINISH_RECORD, () => {
            expect(player.record().getDuration()).toBeWithinRange(3.9, 4.5);
            expect(player.record().getCurrentTime()).toEqual(0);

            // wait till it's loaded before destroying
            // (XXX: create new event for this)
            setTimeout(done, 1000);
        });

        player.one(Event.START_RECORD, () => {
            // pause recording after few seconds
            setTimeout(() => {
                player.record().pause();

                expect(player.record().getDuration()).toBeWithinRange(1.5, 2.5);
                expect(player.record().getCurrentTime()).toEqual(0);

                // resume a few seconds later
                setTimeout(() => {
                    player.record().resume();

                    // stop a few seconds later
                    setTimeout(() => {
                        player.record().stop();
                    }, 2000);
                }, 2000);
            }, 2000);
        });

        player.one(Event.DEVICE_READY, () => {
            // record some
            player.record().start();
        });

        player.one(Event.READY, () => {
            // start device
            player.record().getDevice();
        });
    });

    /** @test {Record#stopDevice} */
    it('stops the device', (done) => {
        // create new player
        player = TestHelpers.makePlayer();

        player.one(Event.FINISH_RECORD, () => {
            // wait till it's loaded before destroying
            // (XXX: create new event for this)
            setTimeout(done, 1000);
        });

        player.one(Event.START_RECORD, () => {
            // stop device after few seconds
            setTimeout(() => {
                player.record().stopDevice();
            }, 2000);
        });

        player.one(Event.DEVICE_READY, () => {
            // record some
            player.record().start();
        });

        player.one(Event.READY, () => {
            // start device
            player.record().getDevice();
        });
    });

    /** @test {Record#timeSlice} */
    it('accepts timeSlice option', (done) => {
        let total = 0;
        // create new player
        player = TestHelpers.makeAudioOnlyPlayer({
            plugins: {
                record: {
                    maxLength: 10,
                    timeSlice: 1000
                }
            }
        });

        player.one(Event.FINISH_RECORD, () => {
            // kill listener
            player.off(Event.TIMESTAMP);

            // wait few seconds
            setTimeout(() => {
                done();
            }, 2000);
        });

        player.on(Event.TIMESTAMP, () => {
            total += 1;

            expect(player.currentTimestamp).toBeDefined();
            expect(player.allTimestamps.length).toEqual(total);

            if (total === 6) {
                player.record().stop();
            }
        });

        player.one(Event.DEVICE_READY, () => {
            // record some
            player.record().start();
        });

        player.one(Event.READY, () => {
            // start device
            player.record().getDevice();
        });
    });

    /** @test {Record#loadOptions} */
    it('reloads options', (done) => {
        // create new player
        player = TestHelpers.makePlayer();

        player.one(Event.READY, () => {
            expect(player.options_.plugins.record.video).toBeFalse();

            let newOptions = {
                video: {
                    facingMode: 'environment'
                }
            };
            player.record().loadOptions(newOptions);

            expect(player.record().recordVideo).toEqual(
                newOptions.video);

            done();
        });
    });

    /** @test {Record#onDeviceReady} */
    it('ignores unsupported audio engine', (done) => {
        // create new player
        player = TestHelpers.makeVideoOnlyPlayer({
            plugins: {
                record: {
                    audioEngine: 'lamejs'
                }
            }
        });

        player.one(Event.READY, () => {
            // start device
            player.record().getDevice();

            // wait few seconds
            setTimeout(() => {
                done();
            }, 2000);
        });
    });

    /** @test {Record#onDeviceReady} */
    it('throws error for unsupported audio engine', (done) => {
        // create new player
        player = TestHelpers.makeAudioOnlyPluginPlayer('foo');

        player.one(Event.ERROR, (e) => {
            expect(e.type).toEqual(Event.ERROR);
            done();
        });

        player.one(Event.READY, () => {
            // start device
            player.record().getDevice();
        });
    });

    /** @test {Record#onDeviceReady} */
    it('accepts a custom audio MIME-type', (done) => {
        let mtype = 'foo/bar';
        // create new player
        player = TestHelpers.makeAudioOnlyPlayer({
            plugins: {
                record: {
                    audioMimeType: mtype
                }
            }
        });

        player.one(Event.DEVICE_READY, () => {
            expect(player.options_.plugins.record.audioMimeType).toEqual(
                mtype);
            expect(player.record().audioMimeType).toEqual(mtype);
            done();
        });

        player.one(Event.READY, () => {
            // start device
            player.record().getDevice();
        });
    });

    /** @test {Record} */
    it('picture-in-picture', (done) => {
        // create new player
        let opts = {
            plugins: {
                record: {
                    pip: true
                }
            }
        };
        player = TestHelpers.makeVideoOnlyPlayer(opts);

        player.one(Event.READY, () => {
            expect(player.pipToggle.el().nodeName).toEqual('BUTTON');
            done();
        });
    });
});
