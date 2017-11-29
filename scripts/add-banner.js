/**
 * Add copyright header to file.
 *
 * @file add-banner.js
 * @since 2.0.0
 */
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var banner = require('add-banner');
var argvAutoGlob = require('argv-auto-glob');

var CSS = '.css';
var JS = '.js';
var infile, fpath, result;
var pjson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// check command-line arguments
process.argv = argvAutoGlob(process.argv);
if (process.argv.length < 3) {
    console.error('Error: no input file(s) specified');
    process.exit();
}

// process multiple input files
process.argv.slice(2).forEach(function(fpath) {
    infile = fs.readFileSync(fpath, 'utf8');
    if (fpath.endsWith(CSS)) {
        // CSS
        result = banner(infile, {
            banner: path.resolve('scripts', 'banner.css'),
            pkg: pjson
        });
        fs.writeFile(fpath, result);

    } else if (fpath.endsWith(JS)) {
        // javascript
        result = banner(infile, {
            banner: path.resolve('scripts', 'banner.ejs'),
            pkg: pjson,
            moment: moment
        });
        fs.writeFile(fpath, result);
    }
    console.info('Added banner to ' + fpath);
});
