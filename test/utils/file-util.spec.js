/**
 * @since 3.3.0
 */

import TestHelpers from '../test-helpers.js';

import {downloadBlob, blobToArrayBuffer, addFileInfo} from '../../src/js/utils/file-util.js';


/** @test {file-util} */
describe('utils.file-util', () => {

    /** @test {downloadBlob} */
    it('downloads Blob', (done) => {
        let req = new Request(TestHelpers.TEST_OGG);
        fetch(req).then((response) => {
            return response.blob();
        }).then((blob) => {
            // download file
            let fileName = 'foo';
            downloadBlob(fileName, blob);
            done();
        });
    });

    /** @test {addFileInfo} */
    it('adds file info', (done) => {
        let req = new Request(TestHelpers.TEST_OGG);
        fetch(req).then((response) => {
            return response.blob();
        }).then((blob) => {
            addFileInfo(blob);

            done();
        });
    });

    /** @test {blobToArrayBuffer} */
    it('transforms Blob to ArrayBuffer', (done) => {
        let req = new Request(TestHelpers.TEST_OGG);
        fetch(req).then((response) => {
            return response.blob();
        }).then((blob) => {
            blobToArrayBuffer(blob).then((buffer) => {
                expect(buffer instanceof ArrayBuffer).toBeTruthy();
                done();
            });
        });
    });
});
