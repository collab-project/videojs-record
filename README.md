Video.js Record
===============

A Video.js plugin for recording audio/video files.

The plugin has the following dependencies:

| Library | Description |
| --- | --- |
| ![Video.js](http://www.videojs.com) | HTML5 media player. |
| ![wavesurfer.js](https://github.com/katspaugh/wavesurfer.js) | Adds navigable waveform for audio files. |
| ![videojs-wavesurfer](https://github.com/collab-project/videojs-wavesurfer) | Turns Video.js into an audio-player. |
| ![RecordRTC.js](http://recordrtc.org) | Media-recording library. |

It also uses the `Microphone` plugin that comes with wavesurfer.js (when recording audio-only).

Using the Plugin
----------------

Start by including these packages and styles on your page:

```html
<link href="http://vjs.zencdn.net/4.11.3/video-js.css" rel="stylesheet">

<script src="http://vjs.zencdn.net/4.11.3/video.js"></script>
<script src="http://recordrtc.org/latest.js"></script>
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

If you want to record an audio/video, or video-only, stream then include a
`video` element on your page:

```html
<video id="myVideo" class="video-js vjs-default-skin"></video>
```

If you're only recording audio, then include an `audio` element instead:

```html
<audio id="myAudio" class="video-js vjs-default-skin"></audio>
```

Plugin options
--------------

Additional options for this plugin.

| option | type | default | description |
| --- | --- | --- | --- |
| `audio` | boolean | `false` | |
| `video` | boolean | `true` | |
| `recordTimeMax` | float | `10` | |

License
-------

This work is licensed under the [MIT License](LICENSE).
