/**
 * Release zip file for github including dist and docs directories.
 *
 * @file release-zip.js
 * @since 2.0.0
 */

const fs = require('fs');
const mv = require('mv');
const del = require('del');
const path = require('path');
const zipdir = require('zip-dir');
const copydir = require('copy-dir');
const {spawn} = require('child_process');
const download = require('download-tarball');

const dirName = 'videojs-record';
const libDir = path.join('node_modules', dirName);
const pjson = JSON.parse(fs.readFileSync(path.resolve(libDir, 'package.json'), 'utf8'));
const version = pjson.version;
const url = 'https://github.com/collab-project/videojs-record/archive/' + version + '.tar.gz';
const targetDir = '/tmp';
const dirNameWithVersion = dirName + '-' + version;
const targetDirRenamed = path.join(targetDir, dirName);
const targetDirUnpacked = path.join(targetDir, dirNameWithVersion);
const zipName = dirNameWithVersion + '.zip';

console.log('-------------------------------------------');
console.log('Generating release for', pjson.name, version);
console.log('-------------------------------------------');


// clean old dir
del([targetDirUnpacked, targetDirRenamed], {force: true, dryRun: false}).then(paths => {
    console.log();

    if (paths.length > 0) {
        paths.forEach((path) => {
            console.log('Deleted', path);
        });
        console.log();
    }

    // download
    console.log('Downloading', url);
    console.log();
    download({
        url: url,
        dir: targetDir

    }).then(() => {
        console.log('File downloaded and extracted at', targetDirUnpacked);
        console.log();

        // docs
        let docPath = path.join(targetDirUnpacked, 'docs');
        console.log('Generated documentation at', docPath);
        console.log();
        const exe = path.join('node_modules', '.bin', 'jsdoc');
        const jsdoc = spawn(exe, [
            libDir + '/src/js/',
            '-c', '.jsdoc-release.json',
            '-d', docPath
        ]);

        // docs ready
        jsdoc.on('close', code => {
            // copy dist
            copydir(path.join(libDir, 'dist'), path.join(targetDirUnpacked, 'dist'), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Copied dist to release target directory.');
                    console.log();

                    // remove version nr from dir
                    mv(targetDirUnpacked, targetDirRenamed, function(err) {
                        // done. it tried fs.rename first, and then falls back to
                        // piping the source file to the dest file and then unlinking
                        // the source file.
                        console.log('Renamed directory to', targetDirRenamed);
                        console.log();

                        zipdir(targetDirRenamed, {saveTo: zipName}, (err, buffer) => {
                            console.log('Zipped directory to', zipName);
                            console.log();

                            console.log('Done!');
                        });
                    });
                }
            });
        });
    }).catch(err => {
        console.log('File could not be downloaded properly!');
        console.log(err);
    });

});
