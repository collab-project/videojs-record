Video.js Record
===============

A Video.js plugin for recording audio/video files.

![Screenshot](/examples/img/screenshot.png?raw=true "Screenshot")

Installation
------------

You can use [bower](http://bower.io) (`bower install videojs-record`) or
[npm](https://www.npmjs.org) (`npm install videojs-record`) to install the
plugin, or download and include `videojs.record.js` in your project.

The plugin has the following mandatory dependencies:

| Library | Description |
| --- | --- |
| ![Video.js](http://www.videojs.com) | HTML5 media player that provides the user interface. |
| ![RecordRTC.js](http://recordrtc.org) | Provides support for audio/video recording. |

If you're going to record audio-only, you'll also need these dependencies:

| Library | Description |
| --- | --- |
| ![wavesurfer.js](https://github.com/katspaugh/wavesurfer.js) | Adds navigable waveform for audio files. Also comes with a ![microphone plugin](http://www.wavesurfer.fm/example/microphone) used for realtime visualization of the microphone. |
| ![videojs-wavesurfer](https://github.com/collab-project/videojs-wavesurfer) | Turns Video.js into an audio-player. |

Using the Plugin
----------------

Whether you're going to record audio or video, or both, you'll always need
video.js and recordrtc.js. Start by including these on your page:

```html
<link href="http://vjs.zencdn.net/4.11.3/video-js.css" rel="stylesheet">

<script src="http://vjs.zencdn.net/4.11.3/video.js"></script>
<script src="http://recordrtc.org/latest.js"></script>
```

The videojs-record plugin automatically registers itself when you include the script
on your page:

```html
<script src="videojs.record.js"></script>
```

You also need to include an extra stylesheet:

```html
<link href="videojs.record.css" rel="stylesheet">
```

### Audio/video

If you want to record an audio/video, or video-only, stream then include a
`video` element on your page:

```html
<video id="myVideo" class="video-js vjs-default-skin"></video>
```

### Audio-only

If you're only recording audio, you also need to include wavesurfer.js and
the videojs-wavesurfer and microphone plugins. Make sure to place them after
the video.js and recordrtc.js scripts.

```html
<script src="http://wavesurfer.fm/build/wavesurfer.min.js"></script>
<script src="http://wavesurfer.fm/plugin/wavesurfer.microphone.js"></script>
<script src="videojs.wavesurfer.js"></script>
```

And define an `audio` element:

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
