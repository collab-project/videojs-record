# Dependencies

## Main

The plugin has the following mandatory dependencies:

- [video.js](https://github.com/videojs/video.js) - HTML5 media player that provides the user interface.
- [webrtc-adapter](https://github.com/webrtc/adapter) - Provides cross-browser support for `getUserMedia` and other browser APIs used in this plugin.

When recording audio and/or video/screen you also need:

- [RecordRTC](https://github.com/muaz-khan/RecordRTC) - Adds support for audio/video/GIF recording.

## Audio

When recording audio-only, the following dependencies are also required
(to visualize the audio waveform):

- [videojs-wavesurfer](https://github.com/collab-project/videojs-wavesurfer) - Transforms video.js into an audio-player using wavesurfer.js.
- [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js) - Provides a navigable waveform for audio files. Comes with a
  [microphone plugin](https://wavesurfer-js.org/plugins/microphone.html) used for real-time visualization of the microphone audio signal.

Optional dependencies when using other [audio plugins](plugins#audio) (note that most of these audio codecs are already available in most modern browsers):

- [vmsg](plugins/vmsg.md) - Converts PCM audio data to compressed MP3 audio. Uses WebAssembly version of LAME encoder.
- [opus-recorder](plugins/opus-recorder.md) - Converts the output of Web Audio API nodes as Opus and exports it into an Ogg container.
- [opus-media-recorder](plugins/opus-media-recorder.md) - Converts PCM audio data with the Opus codec, providing support for various audio formats such as Ogg and WebM.
- [libvorbis.js](plugins/libvorbis.js.md) - Converts PCM audio data to compressed Ogg Vorbis audio, resulting a smaller audio files with similar quality.
- [lamejs](plugins/lamejs.md) - Converts PCM audio data to compressed MP3 audio. Written in JavaScript so not very fast.
- [recorder.js](plugins/recorder.js.md) - A plugin for recording the PCM output of Web Audio API nodes (unmaintained and not recommended).

## Video

Optional dependencies when using other [video plugins](plugins#video):

- [webm-wasm](plugins/webm-wasm.md) - Creates WebM recordings using libwebm (compiled with WebAssembly).

## Convert

Optional dependencies when using [converter plugins](plugins#converter):

- [ts-ebml](plugins/ts-ebml.md) - Creates seekable WebM files, by injecting metadata like duration.
- [ffmpeg.js](plugins/ffmpeg.js.md) - Run [FFmpeg](https://ffmpeg.org) in the browser and perform on-the-fly transcoding of recorded data.
