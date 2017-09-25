/* eslint-disable no-var */
/* eslint-env qunit */
var vr = require('../es5/videojs.record.js');
var q = window.QUnit;

q.module('Browserify Require');
q.test('should be requirable and bundled via browserify', function(assert) {
  assert.ok(vr, 'videojs.record is required properly');
});
