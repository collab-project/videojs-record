/**
 * Update version in file.
 *
 * @file update-version.js
 * @since 2.0.0
 */

var fs = require('fs');
var path = require('path');
var color = require('colour');
var replace = require('replace');
var fpath = path.join('dist', 'videojs.record.js');
var pjson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var version = pjson.version;

replace({
    regex: "Record.VERSION = 'dev';",
    replacement: "Record.VERSION = '" + version + "';",
    paths: [],
    silent: true
});

console.log(color.green('OK') + ': Version in ' + fpath + ' updated to ' + version);
