# Plugins

videojs-record supports third-party libraries to add more features.

## Converter

It's possible to process and convert the recorded data in the browser using the
following plugins:

| Plugin | Description |
| --- | --- |
| [ffmpeg.js](plugins/ffmpeg.js.md) | Run [FFmpeg](https://ffmpeg.org) in the browser and perform on-the-fly transcoding of recorded data. |
| [ts-ebml](plugins/ts-ebml.md) | Creates seekable WebM files, by injecting metadata like duration. |

## Video

RecordRTC is the default recording library but there is also support
for other video libraries:

| Plugin | Description |
| --- | --- |
| [webm-wasm](plugins/webm-wasm.md) | Creates WebM recordings using libwebm (compiled with WebAssembly). |

## Audio

RecordRTC is the default audio recording library but there is also support
for other audio libraries:

| Plugin | Description |
| --- | --- |
| [vmsg](plugins/vmsg.md) | Record MP3 audio using a WebAssembly version of LAME. |
| [opus-recorder](plugins/opus-recorder.md) | Record Opus audio and export it into an Ogg container. |
| [libvorbis.js](plugins/libvorbis.js.md) | Record Ogg Vorbis audio, resulting a smaller audio files with similar quality. |
| [lamejs](plugins/lamejs.md) | Record MP3 audio. Written in JavaScript so not very fast (use [vmsg](plugins/vmsg.md) plugin instead). |
| [recorder.js](plugins/recorder.js.md) | Record PCM audio (library unmaintained and not recommended). |
