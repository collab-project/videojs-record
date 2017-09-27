var fs = require('fs');
var moment = require('moment');
var banner = require('add-banner');

var fpath = 'dist/videojs.record.min.js';
var pjson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var infile = fs.readFileSync(fpath, 'utf8');

var result = banner(infile, {
    banner: 'scripts/banner.ejs',
    pkg: pjson,
    moment: moment
});

fs.writeFile(fpath, result);
