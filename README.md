Video.js Record
===============

A Video.js plugin for recording audio/video files.

![Screenshot](examples/img/screenshot.png?raw=true "Screenshot")

Installation
------------

Use [bower](http://bower.io) (`bower install videojs-record`) or
[npm](https://www.npmjs.org) (`npm install videojs-record`) to install
the plugin or download and include the dependencies manually.

The plugin has the following mandatory dependencies:

- [Video.js](http://www.videojs.com) - HTML5 media player that provides the user interface.
- [RecordRTC.js](http://recordrtc.org) - Adds support for audio/video recording.

When recording audio-only, the following dependencies are also required:

- [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js) - Provides a navigable waveform for audio files. Comes with a [microphone plugin](http://www.wavesurfer.fm/example/microphone) used for realtime visualization of the microphone audio signal.
- [videojs-wavesurfer](https://github.com/collab-project/videojs-wavesurfer) - Turns Video.js into an audio-player.

Using the Plugin
----------------

Whether you're going to record audio or video, or both, you'll always need
video.js and recordrtc.js. Start by including the following:

```html
<link href="http://cdnjs.cloudflare.com/ajax/libs/video.js/4.11.3/video-js.css" rel="stylesheet">

<script src="http://cdnjs.cloudflare.com/ajax/libs/video.js/4.11.3/video.js"></script>
<script src="http://recordrtc.org/latest.js"></script>
```

The videojs-record plugin automatically registers itself when the script
is included on the page:

```html
<script src="videojs.record.js"></script>
```

Add the extra stylesheet that includes a
[custom font](src/css/font) with additional icons:

```html
<link href="videojs.record.css" rel="stylesheet">
```

### Audio/video

When recording both audio/video, or video-only, include a
`video` element:

```html
<video id="myVideo" class="video-js vjs-default-skin"></video>
```

Check out the full [audio/video](examples/audio-video.html "audio/video example") or
[video-only](examples/video-only.html "video-only example") examples.

### Audio-only

![Audio-only screenshot](examples/img/audio-only.png?raw=true "Audio-only screenshot")

When recording audio-only, also include the wavesurfer.js library and
the videojs-wavesurfer and microphone plugins. Make sure to place this before
the `videojs.record.js` script.

```html
<script src="http://wavesurfer.fm/build/wavesurfer.min.js"></script>
<script src="http://wavesurfer.fm/plugin/wavesurfer.microphone.js"></script>
<script src="videojs.wavesurfer.js"></script>
```

And define an `audio` element:

```html
<audio id="myAudio" class="video-js vjs-default-skin"></audio>
```

Check out the full [audio-only](examples/audio-only.html "audio-only example")
example.

Plugin options
--------------

Configure the player using the video.js
[options](https://github.com/videojs/video.js/blob/master/docs/guides/options.md),
and enable the plugin by adding a `record` entry. For example:

```javascript
var player = videojs("myVideo",
{
    controls: true,
    loop: false,
    width: 320,
    height: 240,
    plugins: {
        record: {
            audio: false,
            video: true,
            maxLength: 5
        }
    }
});
```

The available options for this plugin are:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `audio` | boolean | `false` | Include audio in the recorded clip. |
| `video` | boolean | `true` | Include video in the recorded clip. |
| `maxLength` | float | `10` | Maximum length of the recorded clip. |
| `audioBufferSize` | float | `4096` | The size of the audio buffer (in sample-frames per second). Legal values: 256, 512, 1024, 2048, 4096, 8192 and 16384. |
| `audioSampleRate` | float | `22050` | The audio sample rate (in sample-frames per second) at which the `AudioContext` handles audio. Legal values are in the range of 22050 to 96000. |

Plugin events
-------------

Events for this plugin that are available on the video.js player instance:

| Event | Description |
| --- | --- |
| `deviceReady` | Triggered when the device is ready to use. |
| `deviceError` | Triggered when the user doesn't allow the browser to access the microphone. Check `player.deviceErrorCode` for the specific [error code](https://developer.mozilla.org/en-US/docs/NavigatorUserMedia.getUserMedia#errorCallback). |
| `startRecord` | Triggered when the user clicked the record button to start recording. |
| `stopRecord` | Triggered when the user clicked the stop button to stop recording. |
| `finishRecord` | Triggered once the recorded stream is available. Check `player.recordedData` for the Blob data of the recorded clip. |

Get recorded data
-----------------

Listen for the `finishRecord` event and obtain the clip data from the
`player.recordedData` attribute for further processing:

```javascript
// user completed recording and stream is available
player.on('finishRecord', function()
{
    // the blob object contains the recorded data that
    // can be downloaded by the user, stored on server etc.
    console.log('finished recording: ', player.recordedData);
});
```

Customizing controls
--------------------

To disable and hide specific controls, use the video.js `children`
option:

```javascript
children: {
    controlBar: {
        children: {
            // hide fullscreen control
            fullscreenToggle: false
        }
    }
},
```

Localization
------------

This plugin supports multiple languages. Each language has it's own file
(found in the `lang` directory) that contains the translated text.

Using a different language, for example Dutch (`nl`), is done by including
the Video.js language file and the plugin's language file:

```html
<script src="videojs-record/dist/lang/nl.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/video.js/4.11.3/lang/nl.js"></script>
```

And setting the Video.js player's `language` option:

```javascript
language: "nl"
```

Adding support
for an additional language is done by adding a new file with a filename that
consists of the countrycode and the `.json` extension, eg. `fr.json`. The
[build script](#Development) compiles the JSON into a usable language file,
eg. `fr.js`. Check the Video.js wiki for a
[list of supported countrycodes](https://github.com/videojs/video.js/blob/master/docs/guides/languages.md#language-codes).
Pull requests to add more languages to this plugin are always welcome!


More features using other plugins
---------------------------------

The Video.js community created
[lots of plugins](https://github.com/videojs/video.js/wiki/Plugins)
that can be used to enhance the player's functionality. Plugins actually
tested with `videojs-record`:

- [videojs-persistvolume](https://github.com/theonion/videojs-persistvolume) -
  Saves user's volume setting using `localStorage`, but falls back to cookies
  if necessary.

Development
-----------

Install `grunt-cli`:

```
sudo npm install -g grunt-cli
```

Install dependencies using npm:

```
npm install
```

Or using bower:

```
bower install
```

Build a minified version:

```
grunt
```

Generated files are placed in the `dist` directory.

License
-------

This work is licensed under the [MIT License](LICENSE).
