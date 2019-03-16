/**
 * @file defaults.js
 * @since 2.0.0
 */

// plugin defaults
const pluginDefaultOptions = {
    // Single snapshot image.
    image: false,
    // Include audio in the recorded clip.
    audio: false,
    // Include video in the recorded clip.
    video: false,
    // Animated GIF.
    animation: false,
    // Screen capture.
    screen: false,
    // Maximum length of the recorded clip.
    maxLength: 10,
    // Maximum file size of the recorded clip. Works only when the timeSlice
    // option is also enabled.
    maxFileSize: 0,
    // msDisplayMax indicates the number of seconds that is
    // considered the boundary value for displaying milliseconds
    // in the time controls. An audio clip with a total length of
    // 2 seconds and a msDisplayMax of 3 will use the format
    // M:SS:MMM. Clips longer than msDisplayMax will be displayed
    // as M:SS or HH:MM:SS.
    msDisplayMax: 3,
    // Width of the recorded video frames.
    frameWidth: 320,
    // Height of the recorded video frames.
    frameHeight: 240,
    // Enables console logging for debugging purposes.
    debug: false,
    // Enable Picture-in-Picture support.
    pip: false,
    // Turn off the camera/mic (and light) when audio and/or video recording
    // stops, and turns them on again when you resume recording.
    autoMuteDevice: false,
    // Video recording library to use. Legal values are 'recordrtc' (default)
    // and 'webm-wasm'.
    videoEngine: 'recordrtc',
    // The mime type for the video recorder. Default to 'video/webm'.
    // Use 'video/mp4' (Firefox) or 'video/webm;codecs=H264' (Chrome 52 and
    // newer) for MP4.
    videoMimeType: 'video/webm',
    // Video recorder type to use. This allows you to specify an alternative
    // recorder class, e.g. WhammyRecorder from recordrtc. Defaults to 'auto'
    // which let's recordrtc specify the best available recorder type.
    videoRecorderType: 'auto',
    // URL for the video worker. Use an empty string '' to disable (default).
    videoWorkerURL: '',
    // URL for the video worker WebAssembly file. Use an empty string '' to
    // disable (default).
    videoWebAssemblyURL: '',
    // Audio recording library to use. Legal values are 'recordrtc' (default),
    // 'libvorbis.js', 'opus-recorder', 'lamejs', 'vmsg' and 'recorder.js'.
    audioEngine: 'recordrtc',
    // Audio recorder type to use. This allows you to specify an alternative
    // recorder class, e.g. StereoAudioRecorder. Defaults to 'auto' which let's
    // recordrtc specify the best available recorder type. Currently this
    // setting is only used with the 'recordrtc' audioEngine.
    audioRecorderType: 'auto',
    // The mime type for the audio recorder. Defaults to 'auto' which will pick
    // the best option available in the browser (e.g. either 'audio/wav',
    // 'audio/ogg' or 'audio/webm').
    audioMimeType: 'auto',
    // The size of the audio buffer (in sample-frames) which needs to
    // be processed each time onprocessaudio is called.
    // From the spec: This value controls how frequently the audioprocess event is
    // dispatched and how many sample-frames need to be processed each call.
    // Lower values for buffer size will result in a lower (better) latency.
    // Higher values will be necessary to avoid audio breakup and glitches.
    // Legal values are 256, 512, 1024, 2048, 4096, 8192 or 16384.
    audioBufferSize: 4096,
    // The audio sample rate (in sample-frames per second) at which the
    // AudioContext handles audio. It is assumed that all AudioNodes
    // in the context run at this rate. In making this assumption,
    // sample-rate converters or "varispeed" processors are not supported
    // in real-time processing.
    // The sampleRate parameter describes the sample-rate of the
    // linear PCM audio data in the buffer in sample-frames per second.
    // An implementation must support sample-rates in at least
    // the range 22050 to 96000.
    audioSampleRate: 44100,
    // The audio bitrate in kbps (only used in lamejs plugin).
    audioBitRate: 128,
    // Allows you to record single-channel audio, which can reduce the
    // file size.
    audioChannels: 2,
    // URL for the audio worker. Use an empty string '' to disable (default).
    audioWorkerURL: '',
    // URL for the audio worker WebAssembly file. Use an empty string '' to
    // disable (default).
    audioWebAssemblyURL: '',
    // Enables the audioBufferUpdate event that provides realtime AudioBuffer
    // instances from the input audio device.
    audioBufferUpdate: false,
    // Frame rate in frames per second.
    animationFrameRate: 200,
    // Sets quality of color quantization (conversion of images to the
    // maximum 256 colors allowed by the GIF specification).
    // Lower values (minimum = 1) produce better colors,
    // but slow processing significantly. 10 is the default,
    // and produces good color mapping at reasonable speeds.
    // Values greater than 20 do not yield significant improvements
    // in speed.
    animationQuality: 10,
    // Accepts numbers in milliseconds; use this to force intervals-based blobs.
    timeSlice: 0,
    // Media converter library to use. Legal values are 'ts-ebml' or an empty
    // string '' to disable (default).
    convertEngine: '',
    // Enable keyboard hotkeys.
    hotKeys: false
};

export default pluginDefaultOptions;
