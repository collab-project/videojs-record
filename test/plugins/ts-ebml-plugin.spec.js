/**
 * @since 3.3.0
 */

import TestHelpers from '../test-helpers';

import Event from '../../src/js/event';

// registers the plugin
import TsEBMLEngine from '../../src/js/plugins/ts-ebml-plugin';
import {TSEBML} from '../../src/js/engine/convert-engine';


/** @test {TsEBMLEngine} */
describe('plugins.ts-ebml-plugin', () => {
    let player;

    beforeEach(() => {
        // create video-only player with ts-ebml plugin
        player = TestHelpers.makeConvertPluginPlayer(TSEBML);
    });

    afterEach(() => {
        player.dispose();
    });

    /** @test {TsEBMLEngine} */
    it('converts', (done) => {
        player.one(Event.DEVICE_READY, () => {
            let req = new Request(TestHelpers.TEST_WEBM);
            fetch(req).then((response) => {
                return response.blob();
            }).then((blob) => {
                player.one(Event.FINISH_CONVERT, () => {
                    expect(player.convertedData instanceof Blob).toBeTruthy();
                    expect(player.convertedData.name).toEndWith('.webm');

                    let fileName = 'foo';
                    player.record().saveAs({'video': fileName}, 'convert');

                    let element = document.getElementsByTagName('a')[0];
                    expect(element.download).toEqual(fileName);

                    done();
                });
                player.record().converter.convert(blob);
            });
        });

        player.one(Event.READY, () => {
            // start device
            player.record().getDevice();
        });
    });
});
