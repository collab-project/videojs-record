Video.js Record
===============

A [video.js](http://www.videojs.com/) plugin for recording audio/video files.


Using the Plugin
----------------

The plugin depends on the [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js),
[video.js](http://www.videojs.com/) and
[videojs-wavesurfer](https://github.com/collab-project/videojs-wavesurfer) packages. It
also uses the `Microphone` plugin that comes with wavesurfer.js (when recording audio-only).

Start by including these packages and styles on your page:

```html
<link href="http://vjs.zencdn.net/4.11.1/video-js.css" rel="stylesheet">

<script src="http://vjs.zencdn.net/4.11.1/video.js"></script>
<script src="http://wavesurfer.fm/build/wavesurfer.min.js"></script>
<script src="http://wavesurfer.fm/plugin/wavesurfer.microphone.js"></script>
<script src="../../videojs-wavesurfer/videojs.wavesurfer.js"></script>
```

The plugin automatically registers itself when you include `videojs.record.js`
on your page:

```html
<script src="videojs.record.js"></script>
```

You also need to include an extra stylesheet:

```html
<link href="videojs.record.css" rel="stylesheet">
```

If you want to record an audio/video or video-only stream, include an
`video` element on your page:

```html
<video id="myVideo" class="video-js vjs-default-skin"></video>
```

If you're only recording audio, include an `audio` element instead:

```html
<audio id="myAudio" class="video-js vjs-default-skin"></audio>
```

License
-------

This work is licensed under the [MIT License](LICENSE).
