let q = window.QUnit;

let vr = require('../es5/videojs.record.js');

q.module('Webpack Require videojs.record');
q.test('videojs.record should be requirable and bundled via webpack', function(assert) {
    assert.ok(vr, 'videojs.record is required properly');
});


let lame = require('../es5/plugins/lamejs-plugin.js');

q.module('Webpack Require lamejs');
q.test('lamejs plugin should be requirable and bundled via webpack', function(assert) {
    assert.ok(lame, 'videojs.record.lamejs is required properly');
});


let libvorbis = require('../es5/plugins/libvorbis-plugin.js');

q.module('Webpack Require libvorbis');
q.test('libvorbis plugin should be requirable and bundled via webpack', function(assert) {
    assert.ok(libvorbis, 'videojs.record.libvorbis is required properly');
});


let opus = require('../es5/plugins/opus-recorder-plugin.js');

q.module('Webpack Require opus-recorder');
q.test('opus-recorder plugin should be requirable and bundled via webpack', function(assert) {
    assert.ok(opus, 'videojs.record.opus-recorder is required properly');
});


let recorderjs = require('../es5/plugins/recorderjs-plugin.js');

q.module('Webpack Require recorderjs');
q.test('recorderjs plugin should be requirable and bundled via webpack', function(assert) {
    assert.ok(recorderjs, 'videojs.record.recorderjs is required properly');
});
