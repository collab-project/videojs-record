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
        // create new player
        player = TestHelpers.makeVideoOnlyPlayer();

        player.one('ready', function() {
            expect(player.el().nodeName).toEqual('DIV');
            expect(player.on).toBeFunction();

            // plugins exist
            expect(videojs.getPlugin('record')).toBeFunction();

            // correct device button icon
            /*expect(player.deviceButton.buildCSSClass()).endingWith(
                'video-perm')*/
            done();
        });
    });

});
