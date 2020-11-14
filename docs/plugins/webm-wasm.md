# webm-wasm plugin

[webm-wasm](https://github.com/GoogleChromeLabs/webm-wasm) creates WebM
recordings in JavaScript using libwebm (compiled using WebAssembly).

## Example

- [online demo](https://collab-project.github.io/videojs-record/demo/video-only-webm-wasm.html)
- [demo source](https://github.com/collab-project/videojs-record/blob/master/examples/plugins/video-only-webm-wasm.html)

## Usage

Install the library and polyfill:

```console
npm install --save webm-wasm @mattiasbuelens/web-streams-polyfill
```

Import the polyfill and plugin:

```javascript
import '@mattiasbuelens/web-streams-polyfill/dist/polyfill.min.js';
import WebmWasmEngine from 'videojs-record/dist/plugins/videojs.record.webm-wasm.js';
```

And specify the `webm-wasm` `videoEngine`, `videoWorkerURL` and
`videoWebAssemblyURL` options:

```javascript
record: {
    audio: false,
    video: true,
    maxLength: 20,
    debug: true,
    videoEngine: 'webm-wasm',
    videoWorkerURL: '../../node_modules/webm-wasm/dist/webm-worker.js',
    videoWebAssemblyURL: 'webm-wasm.wasm',
    videoBitRate: 1200,
    videoFrameRate: 30
}
```

## Options

Options for this plugin:

| Option | Value | Description |
| --- | --- | --- |
| `videoEngine` | `webm-wasm` | Enables the plugin. |
| `videoWorkerURL` | `/path/to/webm-worker.js` | URL for the video worker. |
| `videoWebAssemblyURL` | `/path/to/webm-wasm.wasm` | Path to WebAssembly file. |
| `videoBitRate` | `1200` | The video bitrate in kbps. |
| `videoFrameRate` | `30` | The video frame rate in frames per second. |
