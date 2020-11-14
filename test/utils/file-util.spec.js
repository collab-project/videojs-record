/**
 * @since 3.3.0
 */

import TestHelpers from '../test-helpers';

import {downloadBlob, blobToArrayBuffer, addFileInfo} from '../../src/js/utils/file-util';


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
            expect(blob.name).toEndWith('oga');

            done();
        });
    });

    /** @test {addFileInfo} */
    it('adds file info with custom file extension', (done) => {
        let req = new Request(TestHelpers.TEST_OGG);
        fetch(req).then((response) => {
            return response.blob();
        }).then((blob) => {
            addFileInfo(blob, new Date(), '.banana');
            expect(blob.name).toEndWith('banana');

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
