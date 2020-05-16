# ffmpeg.js plugin

[FFmpeg](https://ffmpeg.org) is the Swiss-army knife of media transcoding. This plugin allows
you to run FFmpeg in the browser and perform on-the-fly transcoding of recorded data.

This plugin uses [ffmpeg.js](https://github.com/Kagami/ffmpeg.js) that provides FFmpeg
builds ported to JavaScript using the Emscripten project, optimized for in-browser use.

## Example

- [online demo](https://collab-project.github.io/videojs-record/demo/audio-only-ffmpegjs.html)
- [demo source](https://github.com/collab-project/videojs-record/blob/master/examples/plugins/audio-only-ffmpegjs.html)

## Usage

Install the library:

```console
npm install --save ffmpeg.js
```

Import the plugin:

```javascript
import FFmpegjsEngine from 'videojs-record/dist/plugins/videojs.record.ffmpegjs.js';
```

And configure the `ffmpeg.js` `convertEngine`. For example:

```javascript
record: {
    audio: true,
    video: false,
    maxLength: 20,
    debug: true,
    // enable ffmpeg.js plugin
    convertEngine: 'ffmpeg.js',
    // convert recorded data to MP3
    convertOptions: ['-f', 'mp3', '-codec:a', 'libmp3lame', '-qscale:a', '2'],
    // specify MP3 output mime-type
    pluginLibraryOptions: {
        outputType: 'audio/mp3'
    },
    // use MP4 encoding worker (H.264 & AAC & MP3 encoders)
    convertWorkerURL: '../../node_modules/ffmpeg.js/ffmpeg-worker-mp4.js'
    // or use WebM encoding worker (VP8 & Opus encoders)
    // convertWorkerURL: '../../node_modules/ffmpeg.js/ffmpeg-worker-webm.js'
}
```

## Options

Options for this plugin:

| Option | Value | Description |
| --- | --- | --- |
| `convertEngine` | `ffmpeg.js` | Enables the plugin. |
| `convertOptions` | `['-f', 'mp3', '-codec:a', 'libmp3lame', '-qscale:a', '2']` | Array of arguments for FFmpeg. |
| `pluginLibraryOptions` | `{outputType: 'audio/mp3'}` | Specify output mime-type. |
| `convertWorkerURL` | `/path/to/ffmpeg.js/ffmpeg-worker-mp4.js` | Specify encoding worker. |
