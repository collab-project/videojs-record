/**
 * Update version in file.
 *
 * @file update-version.js
 * @since 2.0.0
 */

var fs = require('fs');
var replace = require('replace');
var pjson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var version = pjson.version;

replace({
    regex: "Record.VERSION = 'dev';",
    replacement: "Record.VERSION = '" + version + "';",
    paths: ['./dist/videojs.record.js'],
    silent: true
});
