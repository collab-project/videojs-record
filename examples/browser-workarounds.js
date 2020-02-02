/* workaround browser issues */

var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var isEdge = /Edge/.test(navigator.userAgent);

function applyAudioWorkaround() {
    if (isSafari || isEdge) {
        // see https://github.com/collab-project/videojs-record/issues/295
        options.plugins.record.audioRecorderType = StereoAudioRecorder;
        options.plugins.record.audioSampleRate = 44100;
        options.plugins.record.audioBufferSize = 4096;
        options.plugins.record.audioChannels = 2;
    }
}

function applyVideoWorkaround() {
    // use correct video mimetype for opera
    if (!!window.opera || navigator.userAgent.indexOf('OPR/') !== -1) {
        options.plugins.record.videoMimeType = 'video/webm\;codecs=vp8'; // or vp9
    }
}

function applyScreenWorkaround() {
    // Polyfill in Firefox.
    // See https://blog.mozilla.org/webrtc/getdisplaymedia-now-available-in-adapter-js/
    if (adapter.browserDetails.browser == 'firefox') {
        adapter.browserShim.shimGetDisplayMedia(window, 'screen');
    }
}
