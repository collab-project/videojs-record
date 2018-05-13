/**
 * @since 2.2.0
 */

import TestHelpers from './test-helpers.js';
import * as detectBrowser from '../src/js/utils/detect-browser.js';

// registers the plugin
import Record from '../src/js/videojs.record.js';


jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;


/** @test {Record} */
describe('Record', function() {
    var player;

    afterEach(function() {
        try {
            player.dispose();
        } catch (err) {}
    });

    /** @test {Record} */
    it('should be an advanced plugin instance', function(done) {
        // create new player
        player = TestHelpers.makePlayer();

        player.one('ready', function() {
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
                'audio-perm')
            done();
        });
    });

    /** @test {Record} */
    it('should run as a video-only plugin', function(done) {
        // create video-only plugin
        player = TestHelpers.makeVideoOnlyPlayer();

        player.one('finishRecord', function() {
            // received a blob file
            expect(player.recordedData instanceof Blob).toBeTruthy();

            // wait till it's loaded before destroying
            // (XXX: create new event for this)
            setTimeout(done, 1000);
        });

        player.one('deviceReady', function() {
            // start recording for few seconds
            player.record().start();
            setTimeout(function() {
                // stop recording
                player.record().stop();
            }, 2000);
        });

        player.one('ready', function() {
            // correct device button icon
            expect(player.deviceButton.buildCSSClass().endsWith('video-perm')).toBeTrue();

            // start device
            player.record().getDevice();
        });
    });

    /** @test {Record} */
    it('should run as an image-only plugin', function(done) {
        // create image-only plugin
        player = TestHelpers.makeImageOnlyPlayer();
        // XXX: workaround weird error during test
        // TypeError: Cannot read property 'videoWidth' of null tech error
        player.recordCanvas.el().firstChild.videoWidth = 320;
        player.recordCanvas.el().firstChild.videoHeight = 240;

        player.one('finishRecord', function() {
            // received a base-64 encoded PNG string
            expect(player.recordedData.startsWith('data:image/png;base64,i')).toBeTrue();

            setTimeout(function() {
                done();
            }, 2000);
        });

        player.one('deviceReady', function() {
            // create snapshot
            player.record().start();
        });

        player.one('ready', function() {
            // correct device button icon
            expect(player.deviceButton.buildCSSClass().endsWith('video-perm')).toBeTrue();

            // start device
            player.record().getDevice();
        });
    });

    /** @test {Record} */
    it('should run as an audio-only plugin', function(done) {
        // create audio-only plugin
        player = TestHelpers.makeAudioOnlyPlayer();

        player.one('finishRecord', function() {
            // received a blob file
            expect(player.recordedData instanceof Blob).toBeTruthy();

            // wait till it's loaded before destroying
            // (XXX: create new event for this)
            setTimeout(done, 1000);
        });

        player.one('startRecord', function() {
            // stop recording after few seconds
            setTimeout(function() {
                player.record().stop();
            }, 2000);
        });

        player.one('deviceReady', function() {
            // record some audio
            player.record().start();
        });

        player.one('ready', function() {
            // correct device button icon
            expect(player.deviceButton.buildCSSClass().endsWith('audio-perm')).toBeTrue();

            // start device
            player.record().getDevice();
        });
    });

    /** @test {Record} */
    it('should run as an audio-video plugin', function(done) {
        // create audio-video plugin
        player = TestHelpers.makeAudioVideoPlayer();

        player.one('finishRecord', function() {
            let data = player.recordedData;
            if (detectBrowser.isChrome()) {
                // got an object with a video property containing a blob
                data = player.recordedData.video;
            }
            expect(data instanceof Blob).toBeTruthy();

            // wait till it's loaded before destroying
            // (XXX: create new event for this)
            setTimeout(done, 1000);
        });

        player.one('startRecord', function() {
            // stop recording after few seconds
            setTimeout(function() {
                player.record().stop();
            }, 2000);
        });

        player.one('deviceReady', function() {
            // record some audio+video
            player.record().start();
        });

        player.one('ready', function() {
            // correct device button icon
            expect(player.deviceButton.buildCSSClass().endsWith('av-perm')).toBeTrue();

            // start device
            player.record().getDevice();
        });
    });

    /** @test {Record} */
    it('should run as an animation-only plugin', function(done) {
        // create animated GIF plugin
        player = TestHelpers.makeAnimatedPlayer();

        player.one('ready', function() {
            // correct device button icon
            expect(player.deviceButton.buildCSSClass().endsWith('video-perm')).toBeTrue();

            done();
        });
    });
    
    /** @test {Record#destroy} */
    it('should destroy', function(done) {
        // create new player
        player = TestHelpers.makePlayer();

        player.one('ready', function() {
            expect(player.record().isDestroyed()).toBeFalse();
            player.record().destroy();

            done();
        });
    });

    /** @test {Record#reset} */
    it('should reset', function(done) {
        // create new player
        player = TestHelpers.makePlayer();

        player.one('ready', function() {
            // reset
            player.record().reset();

            expect(player.record().getDuration()).toEqual(0);
            expect(player.record().getCurrentTime()).toEqual(0);
            done();
        });
    });

    /** @test {Record#enumerateDevices} */
    it('should enumerate devices', function(done) {
        // create new player
        player = TestHelpers.makePlayer();

        player.one('enumerateReady', function() {
            expect(player.record().devices).toBeNonEmptyArray();
            done();
        });

        player.one('ready', function() {
            player.record().enumerateDevices();
        });
    });

    /** @test {Record#setAudioOutput} */
    it('should set audio output', function(done) {
        // create new audio player
        player = TestHelpers.makeAudioOnlyPlayer();

        player.one('error', function(e) {
            expect(e.type).toEqual('error');

            done();
        });

        player.one('enumerateReady', function() {
            player.record().setAudioOutput('fakeId');
        });

        player.one('ready', function() {
            player.record().enumerateDevices();
        });
    });

    /** @test {Record#saveAs} */
    it('should save as', function(done) {
        // create new player
        player = TestHelpers.makePlayer();

        player.one('finishRecord', function() {
            player.record().saveAs({'video': 'name-of-video-file'});

            // wait till it's loaded before destroying
            // (XXX: create new event for this)
            setTimeout(done, 1000);
        });

        player.one('startRecord', function() {
            // stop recording after few seconds
            setTimeout(function() {
                player.record().stop();
            }, 2000);
        });

        player.one('deviceReady', function() {
            // record some
            player.record().start();
        });

        player.one('ready', function() {
            // start device
            player.record().getDevice();
        });
    });

    /** @test {Record#getDuration} */
    it('should get duration and current time', function(done) {
        // create new player
        player = TestHelpers.makePlayer();

        player.one('finishRecord', function() {
            expect(player.record().getDuration()).toBeWithinRange(1.5, 2.5);
            expect(player.record().getCurrentTime()).toEqual(0);

            // wait till it's loaded before destroying
            // (XXX: create new event for this)
            setTimeout(done, 1000);
        });

        player.one('startRecord', function() {
            // stop recording after few seconds
            setTimeout(function() {
                player.record().stop();
            }, 2000);
        });

        player.one('deviceReady', function() {
            expect(player.record().getDuration()).toEqual(0);
            expect(player.record().getCurrentTime()).toEqual(0);

            // record some
            player.record().start();
        });

        player.one('ready', function() {
            // start device
            player.record().getDevice();
        });
    });

    /** @test {Record#pause} */
    it('should pause and resume recording', function(done) {
        // create new player
        player = TestHelpers.makePlayer();

        player.one('finishRecord', function() {
            expect(player.record().getDuration()).toBeWithinRange(3.9, 4.5);
            expect(player.record().getCurrentTime()).toEqual(0);

            // wait till it's loaded before destroying
            // (XXX: create new event for this)
            setTimeout(done, 1000);
        });

        player.one('startRecord', function() {
            // pause recording after few seconds
            setTimeout(function() {
                player.record().pause();
                
                expect(player.record().getDuration()).toBeWithinRange(1.5, 2.5);
                expect(player.record().getCurrentTime()).toEqual(0);
                
                // resume a few seconds later
                setTimeout(function() {
                    player.record().resume();
                    
                    // stop a few seconds later
                    setTimeout(function() {
                        player.record().stop();
                    }, 2000);
                }, 2000);
            }, 2000);
        });

        player.one('deviceReady', function() {
            // record some
            player.record().start();
        });

        player.one('ready', function() {
            // start device
            player.record().getDevice();
        });
    });

    /** @test {Record#stopDevice} */
    it('should stop device', function(done) {
        // create new player
        player = TestHelpers.makePlayer();

        player.one('finishRecord', function() {
            // wait till it's loaded before destroying
            // (XXX: create new event for this)
            setTimeout(done, 1000);
        });

        player.one('startRecord', function() {
            // stop device after few seconds
            setTimeout(function() {
                player.record().stopDevice();
            }, 2000);
        });

        player.one('deviceReady', function() {
            // record some
            player.record().start();
        });

        player.one('ready', function() {
            // start device
            player.record().getDevice();
        });
    });
});
