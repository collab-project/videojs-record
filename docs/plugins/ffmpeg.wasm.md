# ffmpeg.wasm plugin

[FFmpeg](https://ffmpeg.org) is the Swiss-army knife of media transcoding. This plugin allows
you to run FFmpeg in the browser and perform on-the-fly transcoding of recorded data.

This plugin uses [ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) that provides a
Webassembly / Javascript port of FFmpeg.

## Example

- [online demo](https://collab-project.github.io/videojs-record/demo/video-only-ffmpegwasm.html)
- [demo source](https://github.com/collab-project/videojs-record/blob/master/examples/plugins/video-only-ffmpegwasm.html)

## Usage

Install the library:

```console
npm install --save @ffmpeg/ffmpeg @ffmpeg/core
```

Include the library and place it before any other scripts:

```html
<script src="@ffmpeg/ffmpeg/dist/ffmpeg.min.js"></script>
```

Import the plugin:

```javascript
import FFmpegWasmEngine from 'videojs-record/dist/plugins/videojs.record.ffmpeg-wasm.js';
```

And configure the `ffmpeg.wasm` `convertEngine`. For example:

```javascript
record: {
    audio: true,
    video: true,
    maxLength: 20,
    debug: true,
    // enable ffmpeg.wasm plugin
    convertEngine: 'ffmpeg.wasm',
    convertWorkerURL: '../../node_modules/@ffmpeg/core/dist/ffmpeg-core.js',
    // convert recorded data to MP4 (and copy over audio data without encoding)
    convertOptions: ['-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-c:a', 'copy', '-f', 'mp4'],
    // specify output mime-type
    pluginLibraryOptions: {
        outputType: 'video/mp4'
    }
}
```

## Options

Options for this plugin:

| Option | Value | Description |
| --- | --- | --- |
| `convertEngine` | `ffmpeg.wasm` | Enables the plugin. |
| `convertOptions` | `['-f', 'mp3', '-codec:a', 'libmp3lame', '-qscale:a', '2']` | Array of arguments for FFmpeg. |
| `pluginLibraryOptions` | `{outputType: 'video/mp4'}` | Specify output mime-type and other options. |
| `convertWorkerURL` | `/path/to/@ffmpeg/core/dist/ffmpeg-core.js` | Specify encoding worker. |
