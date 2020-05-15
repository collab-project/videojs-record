# vmsg plugin

[vmsg](https://github.com/Kagami/vmsg) provides a WebAssembly version of LAME, a fast
and lightweight MP3 encoder. vmsg is currently only supported when recording audio-only.

## Example

- [online demo](https://collab-project.github.io/videojs-record/demo/audio-only-mp3.html)
- [demo source](https://github.com/collab-project/videojs-record/blob/master/examples/plugins/audio-only-mp3.html)

## Usage

Include the `videojs.record.vmsg.js` plugin:

```html
<script src="dist/videojs.record.js"></script>
<script src="dist/plugins/videojs.record.vmsg.js"></script>
```

And specify the `vmsg` `audioEngine` and `audioWorkerURL` options. Use the
`pluginLibraryOptions` option to specify optional settings for the vmsg library.

For example:

```javascript
record: {
    audio: true,
    video: false,
    maxLength: 20,
    debug: true,
    // enable vmsg plugin
    audioEngine: 'vmsg',
    audioWebAssemblyURL: '../../node_modules/vmsg/vmsg.wasm'
    // use the pluginLibraryOptions option to specify optional settings for the
    // vmsg library. For example:
    //pluginLibraryOptions: {
    //    shimURL: '/static/js/wasm-polyfill.js',
    //    pitch: 1
    //}
}
```

## Options

Options for this plugin:

| Option | Value | Description |
| --- | --- | --- |
| `audioEngine` | `vmsg` | Enables the plugin. |
| `audioWebAssemblyURL` | `/path/to/vmsg.wasm` | Path to WebAssembly file. |
| `pluginLibraryOptions` | `{}` | Specify optional settings for the vmsg library. |
