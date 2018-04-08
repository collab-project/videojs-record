/**
 * @since 2.2.0
 */

import TestHelpers from './test-helpers.js';

// registers the plugin
import Record from '../src/js/videojs.record.js';


/** @test {Record} */
describe('Record', function() {
    var player;

    beforeEach(function() {
        // cleanup all players
        TestHelpers.cleanup();

        // create new player
        player = TestHelpers.makePlayer();
    });

    /** @test {Record} */
    it('should be an advanced plugin instance', function(done) {

        player.one('ready', function() {
            expect(player.el().nodeName).toEqual('DIV');
            expect(player.on).toBeFunction();

            // plugins exist
            expect(videojs.getPlugin('wavesurfer')).toBeFunction();
            expect(videojs.getPlugin('record')).toBeFunction();

            // plugin version number is correct
            let version = require('../package.json').version;
            expect(videojs.getPluginVersion('record')).toEqual(version);

            done();
        });
    });

});
