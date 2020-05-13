# webm-wasm plugin

[webm-wasm](https://github.com/GoogleChromeLabs/webm-wasm) creates WebM
recordings in JavaScript using libwebm (compiled using WebAssembly).

## Example

- [online demo](https://collab-project.github.io/videojs-record/demo/video-only-webm-wasm.html)
- [demo source](https://github.com/collab-project/videojs-record/blob/master/examples/plugins/video-only-webm-wasm.html)

## Usage

Include the `videojs.record.webm-wasm.js` plugin:

```html
<script src="dist/videojs.record.js"></script>
<script src="dist/plugins/videojs.record.webm-wasm.js"></script>
```

And specify the `webm-wasm` `videoEngine`, `videoWorkerURL` and
`videoWebAssemblyURL` options.
