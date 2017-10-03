/**
 * Release zip file for github including dist directory.
 *
 * @file release-zip.js
 * @since 2.0.0
 */

var fs = require('fs');
var mv = require('mv');
var del = require('del');
var path = require('path');
var zipdir = require('zip-dir');
var copydir = require('copy-dir');
var download = require('download-tarball');
var pjson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

var version = pjson.version;
var url = 'https://github.com/collab-project/videojs-record/archive/' + version + '.tar.gz';
var targetDir = '/tmp';
var dirName = 'videojs-record';
var dirNameWithVersion = dirName + '-' + version;
var targetDirRenamed = path.join(targetDir, dirName);
var targetDirUnpacked = path.join(targetDir, dirNameWithVersion);
var zipName = dirNameWithVersion + '.zip';

// clean old dir
del([targetDirUnpacked, targetDirRenamed], {force: true, dryRun: false}).then(paths => {
    console.log();

    if (paths.length > 0) {
        paths.forEach(function(path) {
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

        // copy dist
        copydir('dist', path.join(targetDirUnpacked, 'dist'), function(err) {
            if (err){
                console.log(err);
            } else {
                console.log('Copied dist to release target directory.');
                console.log();

                copydir('es5', path.join(targetDirUnpacked, 'es5'), function(err) {
                    if (err){
                        console.log(err);
                    } else {
                        console.log('Copied es5 to release target directory.');
                        console.log();

                        copydir('docs', path.join(targetDirUnpacked, 'docs'), function(err) {
                            if (err){
                                console.log(err);
                            } else {
                                console.log('Copied docs to release target directory.');
                                console.log();

                                // remove version nr from dir
                                mv(targetDirUnpacked, targetDirRenamed, function(err) {
                                    // done. it tried fs.rename first, and then falls back to
                                    // piping the source file to the dest file and then unlinking
                                    // the source file.
                                    console.log('Renamed directory to', targetDirRenamed);
                                    console.log();

                                    zipdir(targetDirRenamed, { saveTo: zipName }, function (err, buffer) {
                                        console.log('Zipped directory to', zipName);
                                        console.log();

                                        console.log('Done!');
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });

    }).catch(err => {
        console.log('File could not be downloaded properly!');
        console.log(err);
    });

});
