# opus-recorder plugin

[opus-recorder](https://github.com/chris-rudmin/Recorderjs) provides a Javascript
implementation of PCM to Opus encoder and exports it into an Ogg container.
opus-recorder is currently only supported when recording audio-only.

Include the recorder.js script (instead of RecordRTC.js) and place it before
any other scripts:

```html
<script src="recorder.js"></script>
```

And include the `videojs.record.opus-recorder.js` plugin:

```html
<script src="dist/videojs.record.js"></script>
<script src="dist/plugins/videojs.record.opus-recorder.js"></script>
```

And specify the `opus-recorder` `audioEngine` and `audioWorkerURL` options.
Use the `pluginLibraryOptions` option to specify optional settings for the opus-recorder library. For example:

```javascript
pluginLibraryOptions: {
    monitorGain: 0.4,
    originalSampleRateOverride: 16000
}
```

Check out the audio-only Opus example ([demo](https://collab-project.github.io/videojs-record/examples/audio-only-opus.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/plugins/audio-only-opus.html)).
