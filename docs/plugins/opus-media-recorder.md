# opus-media-recorder plugin

[opus-media-recorder](https://github.com/kbumsik/opus-media-recorder) provides a MediaRecorder API polyfill written in ES6 and WebAssembly. It aims for cross-browser Opus codec support with various audio formats such as Ogg and WebM. opus-media-recorder uses WebAssembly compiled from popular libraries (e.g libopus, libogg, libwebm, and speexdsp) to ensure good performance and standards-compliance.

The opus-media-recorder plugin is currently only supported when recording audio-only.

## Example

- [online demo](https://collab-project.github.io/videojs-record/demo/audio-only-opus-media-recorder.html)
- [demo source](https://github.com/collab-project/videojs-record/blob/master/examples/plugins/audio-only-opus-media-recorder.html)

## Usage

Install the library:

```console
npm install --save opus-media-recorder
```

Include the opus-media-recorder scripts and place them before any other scripts:

```html
<script src="opus-media-recorder/OpusMediaRecorder.umd.js"></script>
```

Enable the polyfill:

```javascript
// Polyfill MediaRecorder
window.MediaRecorder = OpusMediaRecorder;
```

Import the plugin:

```javascript
import OpusMediaRecorderEngine from 'videojs-record/dist/plugins/videojs.record.opus-media-recorder.js';
```

And specify the `opus-media-recorder` `audioEngine`, `audioWorkerURL` and
`audioWebAssemblyURL` options.

For example:

```javascript
record: {
    audio: true,
    video: false,
    maxLength: 20,
    debug: true,
    audioEngine: 'opus-media-recorder',
    audioWorkerURL: '../../node_modules/opus-media-recorder/encoderWorker.umd.js'
    audioWebAssemblyURL: {
        OggOpusEncoderWasmPath: '../../node_modules/opus-media-recorder/OggOpusEncoder.wasm',
        WebMOpusEncoderWasmPath: '../../node_modules/opus-media-recorder/WebMOpusEncoder.wasm'
    }
}
```

## Options

Options for this plugin:

| Option | Value | Description |
| --- | --- | --- |
| `audioEngine` | `opus-media-recorder` | Enables the plugin. |
| `audioWorkerURL` | `/path/to/encoderWorker.umd.js` | Path to encoder WebWorker file. |
| `audioWebAssemblyURL` | `{OggOpusEncoderWasmPath: '/path/to/OggOpusEncoder.wasm', WebMOpusEncoderWasmPath: '/path/to/WebMOpusEncoder.wasm'}` | Paths to Ogg and WebM encoder WASM files. |
