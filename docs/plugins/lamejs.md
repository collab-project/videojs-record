# lamejs plugin

[lamejs](https://github.com/zhuker/lamejs) provides a Javascript
implementation of a PCM to MP3 encoder and you can choose to use this
instead of RecordRTC. lamejs is currently only supported when recording
audio-only.

Include the `videojs.record.lamejs.js` plugin:

```html
<script src="dist/videojs.record.js"></script>
<script src="dist/plugins/videojs.record.lamejs.js"></script>
```

Enable lamejs by specifying the `lamejs` `audioEngine` and the
`audioWorkerURL` options.

Check out the audio-only MP3 example ([demo](https://collab-project.github.io/videojs-record/examples/audio-only-lamejs.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/plugins/audio-only-lamejs.html)).
