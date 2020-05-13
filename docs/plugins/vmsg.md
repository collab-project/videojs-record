# vmsg plugin

[vmsg](https://github.com/Kagami/vmsg) provides a WebAssembly version of LAME, a fast
and lightweight MP3 encoder. vmsg is currently only supported when recording audio-only.

Include the `videojs.record.vmsg.js` plugin:

```html
<script src="dist/videojs.record.js"></script>
<script src="dist/plugins/videojs.record.vmsg.js"></script>
```

And specify the `vmsg` `audioEngine` and `audioWorkerURL` options. Use the
`pluginLibraryOptions` option to specify optional settings for the vmsg library.

For example:

```javascript
pluginLibraryOptions: {
    shimURL: '/static/js/wasm-polyfill.js',
    pitch: 1
}
```

Check out the audio-only MP3 example ([demo](https://collab-project.github.io/videojs-record/examples/audio-only-mp3.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/plugins/audio-only-mp3.html)).
