/* workaround browser issues */

var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var isEdge = /Edge/.test(navigator.userAgent);

function applyAudioWorkaround() {
    if (isSafari || isEdge) {
        console.log('applied workarounds for this browser');

        // see https://github.com/collab-project/videojs-record/issues/295
        options.plugins.record.audioRecorderType = StereoAudioRecorder;
        options.plugins.record.audioSampleRate = 44100;
        options.plugins.record.audioBufferSize = 4096;
        options.plugins.record.audioChannels = 2;
    }
}

function applyScreenWorkaround() {
    // Polyfill in Firefox.
    // See https://blog.mozilla.org/webrtc/getdisplaymedia-now-available-in-adapter-js/
    if (adapter.browserDetails.browser == 'firefox') {
        adapter.browserShim.shimGetDisplayMedia(window, 'screen');
    }
}