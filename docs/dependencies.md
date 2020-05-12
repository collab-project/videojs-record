# Dependencies

The plugin has the following mandatory dependencies:

- [Video.js](https://github.com/videojs/video.js) - HTML5 media player that provides the user interface.
- [webrtc-adapter](https://github.com/webrtc/adapter) - Provides cross-browser support for getUserMedia and other browser APIs used in this plugin.

When recording audio and/or video you also need:

- [RecordRTC](https://github.com/muaz-khan/RecordRTC) - Adds support for audio/video/GIF recording.

And when recording audio-only, the following dependencies are also required (
to visualize the audio waveform):

- [videojs-wavesurfer](https://github.com/collab-project/videojs-wavesurfer) - Transforms video.js into an audio-player using wavesurfer.js.
- [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js) - Provides a navigable waveform for audio files. Comes with a
  [microphone plugin](https://wavesurfer-js.org/plugins/microphone.html) used for real-time visualization of the microphone audio signal.

Optional dependencies when using [other audio libraries](#other-audio-libraries) (note that most of these audio codecs are already available in most modern browsers):

- [vmsg](https://github.com/collab-project/videojs-record/wiki/Plugins#vmsg) - Converts PCM audio data to compressed MP3 audio. Uses WebAssembly version of LAME encoder.
- [opus-recorder](https://github.com/collab-project/videojs-record/wiki/Plugins#opus-recorder) - Converts the output of Web Audio API nodes as Opus and exports it into an Ogg container.
- [libvorbis.js](https://github.com/collab-project/videojs-record/wiki/Plugins#libvorbisjs) - Converts PCM audio data to compressed Ogg Vorbis audio, resulting a smaller audio files with similar quality.
- [lamejs](https://github.com/collab-project/videojs-record/wiki/Plugins#lamejs) - Converts PCM audio data to compressed MP3 audio. Written in JavaScript so not very fast.
- [recorder.js](https://github.com/collab-project/videojs-record/wiki/Plugins#recorderjs) - A plugin for recording the PCM output of Web Audio API nodes.

Optional dependencies when using [other video libraries](#other-video-libraries):

- [webm-wasm](https://github.com/collab-project/videojs-record/wiki/Plugins#webm-wasm) - Creates WebM recordings using libwebm (compiled with WebAssembly).

Optional dependencies when using [converter libraries](#convert-data):

- [ts-ebml](https://github.com/collab-project/videojs-record/wiki/Plugins#ts-ebml) - Creates seekable WebM files, by injecting metadata like duration.
- [ffmpeg.js](https://github.com/collab-project/videojs-record/wiki/Plugins#ffmpegjs) - [FFmpeg](https://ffmpeg.org) builds ported to JavaScript using Emscripten.
