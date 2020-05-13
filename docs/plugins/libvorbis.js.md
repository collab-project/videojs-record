# libvorbis.js plugin

Microphone recordings can result in large audio files, especially when there is
no native support for other audio formats (.ogg for example) in the browser
(like Chrome).

[libvorbis.js](https://github.com/Garciat/libvorbis.js) provides a Javascript
implementation of a PCM to Ogg Vorbis encoder and you can choose to use this
instead of RecordRTC. libvorbis.js is currently only supported when recording
audio-only.

Include the libvorbis.js library (instead of RecordRTC.js) and place it before
any other scripts:

```html
<script src="libvorbis.min.js"></script>
```

Also include the `videojs.record.libvorbis.js` plugin:

```html
<script src="dist/videojs.record.js"></script>
<script src="dist/plugins/videojs.record.libvorbis.js"></script>
```

And use `libvorbis.js` for the `audioEngine` option.

Check out the audio-only Ogg example ([demo](https://collab-project.github.io/videojs-record/examples/audio-only-ogg.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/plugins/audio-only-ogg.html)).