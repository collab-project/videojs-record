/**
 * @file record-toggle.js
 */

const Button = videojs.getComponent('Button');

/**
 * Button to toggle between start and stop recording.
 * @private
 * @class
 * @augments videojs.Button
*/
const RecordToggle = videojs.extend(Button, {
    /** @constructor */
    constructor: function(player, options) {
        Button.call(this, player, options);

        this.on('click', this.onClick);
        this.on('tap', this.onClick);
        this.on(player, 'startRecord', this.onStart);
        this.on(player, 'stopRecord', this.onStop);
    }
});

RecordToggle.prototype.onClick = function(e) {
    // stop this event before it bubbles up
    e.stopImmediatePropagation();

    var recorder = this.player().recorder;

    if (!recorder.isRecording()) {
        recorder.start();
    } else {
        recorder.stop();
    }
};

RecordToggle.prototype.onStart = function() {
    // replace element class so it can change appearance
    this.removeClass('vjs-icon-record-start');
    this.addClass('vjs-icon-record-stop');

    // update label
    this.el().firstChild.firstChild.innerHTML = this.localize('Stop');
};

RecordToggle.prototype.onStop = function() {
    // replace element class so it can change appearance
    this.removeClass('vjs-icon-record-stop');
    this.addClass('vjs-icon-record-start');

    // update label
    this.el().firstChild.firstChild.innerHTML = this.localize('Record');
};

export default RecordToggle;
