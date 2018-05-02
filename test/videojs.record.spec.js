/**
 * @since 2.2.0
 */

import TestHelpers from './test-helpers.js';

// registers the plugin
import Record from '../src/js/videojs.record.js';


/** @test {Record} */
describe('Record', function() {
    var player;

    afterEach(function() {
        player.dispose();
    });

    /** @test {Record} */
    it('should be an advanced plugin instance', function(done) {
        // create new player
        player = TestHelpers.makePlayer();

        player.one('ready', function() {
            expect(player.el().nodeName).toEqual('DIV');
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
        });

        player.one('startRecord', function() {
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
    it('should run as an animation-only plugin', function(done) {
        // create animated GIF plugin
        player = TestHelpers.makeAnimatedPlayer();

        player.one('ready', function() {
            // correct device button icon
            expect(player.deviceButton.buildCSSClass().endsWith('video-perm')).toBeTrue();

            done();
        });
    });
});
