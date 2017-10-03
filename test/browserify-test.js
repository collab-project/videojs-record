/* eslint-disable no-var */
/* eslint-env qunit */
var q = window.QUnit;

var vr = require('../es5/videojs.record.js');

q.module('Browserify Require videojs.record');
q.test('videojs.record should be requirable and bundled via browserify', function(assert) {
    assert.ok(vr, 'videojs.record is required properly');
});

var lame = require('../es5/plugins/lamejs-plugin.js');

q.module('Browserify Require lamejs');
q.test('lamejs plugin should be requirable and bundled via browserify', function(assert) {
    assert.ok(lame, 'videojs.record.lamejs is required properly');
});


var libvorbis = require('../es5/plugins/libvorbis-plugin.js');

q.module('Browserify Require libvorbis');
q.test('libvorbis plugin should be requirable and bundled via browserify', function(assert) {
    assert.ok(libvorbis, 'videojs.record.libvorbis is required properly');
});


var opus = require('../es5/plugins/opus-recorder-plugin.js');

q.module('Browserify Require opus-recorder');
q.test('opus-recorder plugin should be requirable and bundled via browserify', function(assert) {
    assert.ok(opus, 'videojs.record.opus-recorder is required properly');
});


var recorderjs = require('../es5/plugins/recorderjs-plugin.js');

q.module('Browserify Require recorderjs');
q.test('recorderjs plugin should be requirable and bundled via browserify', function(assert) {
    assert.ok(recorderjs, 'videojs.record.recorderjs is required properly');
});
