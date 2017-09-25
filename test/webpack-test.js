let vr = require('../es5/videojs.record.js');
let q = window.QUnit;

q.module('Webpack Require');
q.test('should be requirable and bundled via webpack', function(assert) {
  assert.ok(vr, 'videojs.record is required properly');
});
