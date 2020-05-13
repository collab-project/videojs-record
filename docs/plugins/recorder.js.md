# recorder.js plugin

[recorder.js](https://github.com/mattdiamond/Recorderjs) is another plugin for
recording/exporting PCM output of Web Audio API nodes, similar to RecordRTC.
recorder.js is currently only supported when recording audio-only.

Include the recorder.js library (instead of RecordRTC.js) on the page:

```html
<script src="recorder.js" async></script>
```

And include the `videojs.record.recorderjs.js` plugin:

```html
<script src="dist/videojs.record.js"></script>
<script src="dist/plugins/videojs.record.recorderjs.js"></script>
```

And specify the `recorder.js` `audioEngine` option.

Check out the audio-only recorder.js example ([demo](https://collab-project.github.io/videojs-record/examples/audio-only-recorderjs.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/plugins/audio-only-recorderjs.html)).
