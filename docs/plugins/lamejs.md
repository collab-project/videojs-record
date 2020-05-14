# lamejs plugin

[lamejs](https://github.com/zhuker/lamejs) provides a Javascript
implementation of a PCM to MP3 encoder and you can choose to use this
instead of RecordRTC. lamejs is currently only supported when recording
audio-only.

## Example

- [online demo](https://collab-project.github.io/videojs-record/demo/audio-only-lamejs.html)
- [demo source](https://github.com/collab-project/videojs-record/blob/master/examples/plugins/audio-only-lamejs.html)

## Usage

Include the `videojs.record.lamejs.js` plugin:

```html
<script src="dist/videojs.record.js"></script>
<script src="dist/plugins/videojs.record.lamejs.js"></script>
```

Enable lamejs by specifying the `lamejs` `audioEngine` and the
`audioWorkerURL` options:

```javascript
record: {
    audio: true,
    video: false,
    maxLength: 20,
    debug: true,
    audioEngine: 'lamejs',
    audioWorkerURL: '../../node_modules/lamejs/worker-example/worker-realtime.js',
    audioSampleRate: 44100,
    audioBitRate: 128
}
```

## Options

Options for this plugin:

| Option | Value | Description |
| --- | --- | --- |
| `audioEngine` | `lamejs` | Enables the plugin. |
| `audioWorkerURL` | `/path/to/worker-realtime.js` | Path to WebWorker file. |
| `audioBitRate` | `128` | The audio bitrate in kbps. |
| `audioSampleRate` | `44100` | The audio sample rate (in sample-frames per second) at which the `AudioContext` handles audio. Legal values are in the range of 22050 to 96000. |
