Video.js Record
===============

Video.js plugin for recording audio/video/image files.

<img title="Screenshot" src="examples/img/screenshot.png?raw=true" width="329">

[![npm version](https://img.shields.io/npm/v/videojs-record.svg?style=flat)](https://www.npmjs.com/package/videojs-record)
[![npm](https://img.shields.io/npm/dm/videojs-record.svg)](https://github.com/collab-project/videojs-record/releases)
[![License](https://img.shields.io/npm/l/videojs-record.svg)](LICENSE)
[![Build Status](https://travis-ci.org/collab-project/videojs-record.svg?branch=master)](https://travis-ci.org/collab-project/videojs-record)

Installation
------------

Use [bower](http://bower.io) (`bower install videojs-record`) or
[npm](https://www.npmjs.org) (`npm install videojs-record`) to install
the plugin or [download](https://github.com/collab-project/videojs-record/releases)
the library and dependencies elsewhere.

Since v1.0 this plugin is compatible with video.js 5.0 and newer. If you want to use
this plugin with an older video.js 4.x version, check the
[archived releases](https://github.com/collab-project/videojs-record/releases)
for a 0.9.x or older release.

Take a look at the [changelog](./CHANGES.md) when upgrading from a previous
version of videojs-record.

Dependencies
------------

The plugin has the following mandatory dependency:

- [Video.js](https://github.com/videojs/video.js) - HTML5 media player that provides the user interface.

When recording audio and/or video you also need:

- [RecordRTC.js](https://github.com/muaz-khan/RecordRTC) - Adds support for audio/video/GIF recording.

And when recording audio-only, the following dependencies are also required:

- [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js) - Provides a navigable waveform for audio files. Comes with a [microphone plugin](https://katspaugh.github.io/wavesurfer.js/example/microphone) used for realtime visualization of the microphone audio signal.
- [videojs-wavesurfer](https://github.com/collab-project/videojs-wavesurfer) - Transforms Video.js into an audio-player.

Optional dependencies when using [other audio libraries](#other-audio-libraries):

- [libvorbis.js](#libvorbisjs) - Converts PCM audio data to compressed Ogg Vorbis audio, resulting a smaller audio files with similar quality.
- [lamejs](#lamejs) - Converts PCM audio data to compressed MP3 audio.
- [opus-recorder](#opus-recorder) - Converts the output of Web Audio API nodes as Opus and exports it into an Ogg container.
- [recorder.js](#recorderjs) - A plugin for recording the PCM output of Web Audio API nodes.

Usage
-----

Start by including the video.js stylesheet and library:

```html
<link href="//vjs.zencdn.net/5.8.7/video-js.css" rel="stylesheet">
<script src="//vjs.zencdn.net/5.8.7/video.min.js"></script>
```

If you're going to record audio and/or video you need to include RecordRTC as well:

```html
<script src="//cdn.webrtc-experiment.com/RecordRTC.js"></script>
```

The videojs-record plugin automatically registers itself when the script
is included on the page:

```html
<script src="videojs.record.js"></script>
```

Add the extra stylesheet for the plugin that includes a
[custom font](src/css/font) with additional icons:

```html
<link href="videojs.record.css" rel="stylesheet">
```

### Audio/video/image

When recording either audio/video, video-only, animated GIF or a single image,
include a `video` element:

```html
<video id="myVideo" class="video-js vjs-default-skin"></video>
```

Check out the examples:

- audio/video ([demo](https://collab-project.github.io/videojs-record/examples/audio-video.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/audio-video.html))
- video-only ([demo](https://collab-project.github.io/videojs-record/examples/video-only.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/video-only.html))
- image ([demo](https://collab-project.github.io/videojs-record/examples/image-only.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/image-only.html))
- animated GIF ([demo](https://collab-project.github.io/videojs-record/examples/animated-gif.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/animated-gif.html))

Note that recording both audio and video into a single WebM file is currently
only supported in Mozilla Firefox >= 29 and Chrome >= 49. In older versions of
the Chrome browser two separate Blob objects are created: one for audio and one
for video.

### Audio-only

![Audio-only screenshot](examples/img/audio-only.png?raw=true "Audio-only screenshot")

When recording audio-only, also include the wavesurfer.js library and
the videojs-wavesurfer and microphone plugins. Make sure to place this before
the `videojs.record.js` script.

```html
<script src="//katspaugh.github.io/wavesurfer.js/dist/wavesurfer.min.js"></script>
<script src="//katspaugh.github.io/wavesurfer.js/dist/plugin/wavesurfer.microphone.min.js"></script>
<script src="videojs.wavesurfer.js"></script>
```

And define an `audio` element:

```html
<audio id="myAudio" class="video-js vjs-default-skin"></audio>
```

Check out the full audio-only example ([demo](https://collab-project.github.io/videojs-record/examples/audio-only.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/audio-only.html)).

There is also support for [additional audio libraries](#other-audio-libraries)
that allows you to record audio with codecs like Ogg Vorbis, MP3 and Opus.

Options
-------

Configure the player using the video.js
[options](https://github.com/videojs/video.js/blob/master/docs/guides/options.md),
and enable the plugin by adding a `record` configuration to `plugins`. For
example:

```javascript
var player = videojs("myVideo",
{
    // video.js options
    controls: true,
    loop: false,
    width: 320,
    height: 240,
    plugins: {
        // videojs-record plugin options
        record: {
            image: false,
            audio: false,
            video: true,
            maxLength: 5,
            debug: true
        }
    }
});
```

The available options for this plugin are:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `image` | boolean or object | `false` | Create single snapshot image. |
| `audio` | boolean or object | `false` | Include audio in the recorded clip. |
| `video` | boolean or object | `false` | Include video in the recorded clip. |
| `animation` | boolean or object | `false` | Animated GIF. |
| `debug` | boolean | `false` | Enables console log messages during recording for debugging purposes. |
| `maxLength` | float | `10` | Maximum length of the recorded clip. |
| `frameWidth` | float | `320` | Width of the recorded video frames. Use [media constraints](#media-constraints) to change the camera resolution width. |
| `frameHeight` | float | `240` | Height of the recorded video frames. Use [media constraints](#media-constraints) to change the camera height. |
| `audioEngine` | string | `recordrtc` | Audio recording library to use. Legal values are `recordrtc`, `libvorbis.js`, `lamejs`, `opus-recorder` and `recorder.js`. |
| `audioRecorderType` | string or function | `auto` | Audio recorder type to use. This allows you to specify an alternative recorder class, e.g. `StereoAudioRecorder`. Defaults to `auto` which let's recordrtc specify the best available recorder type. Currently this setting is only used with the 'recordrtc' `audioEngine`. |
| `audioBufferSize` | float | `4096` | The size of the audio buffer (in sample-frames per second). Legal values: 0, 256, 512, 1024, 2048, 4096, 8192 and 16384. |
| `audioSampleRate` | float | `44100` | The audio sample rate (in sample-frames per second) at which the `AudioContext` handles audio. Legal values are in the range of 22050 to 96000. |
| `audioChannels` | float | `2` | Number of audio channels. Using a single channel results in a smaller filesize. |
| `audioWorkerURL` | string | `''` | URL for the audio worker, for example: `/opus-recorder/oggopusEncoder.js`. Currently only used for opus-recorder and lamejs. |
| `videoRecorderType` | string or function | `auto` | Video recorder type to use. This allows you to specify an alternative recorder class, e.g. `WhammyRecorder`. Defaults to `auto` which let's recordrtc specify the best available recorder type. |
| `animationFrameRate` | float | `200` | Frame rate for animated GIF (in frames per second). |
| `animationQuality` | float | `10` | Sets quality of color quantization (conversion of images to the maximum 256 colors allowed by the GIF specification). Lower values (minimum = 1) produce better colors, but slow processing significantly. The default produces good color mapping at reasonable speeds. Values greater than 20 do not yield significant improvements in speed. |

Methods
-------

Methods for this plugin documented below are available on the `recorder` object
of the video.js player instance. For example:

```javascript
player.recorder.destroy();
```

| Method | Description |
| --- | --- |
| `isRecording` | Returns a boolean indicating whether recording is active or not. |
| `getRecordType` | Get recorder type as string. Either `image_only`, `animation`, `audio_only`, `video_only` or `audio_video`. |
| `destroy` | Destroys the recorder instance and children (including the video.js player). |
| `stopDevice` | Stop the recording and the active audio and/or video device(s). |
| `getDevice` | Start the audio and/or video device(s). |
| `enumerateDevices` | [Get async list of media input and output devices](#controlling-the-input-and-output-devices) available on the system. |

Events
------

Plugin events that are available on the video.js player instance. For example:

```javascript
player.on('startRecord', function()
{
    console.log('started recording!');
});
```

| Event | Description |
| --- | --- |
| `deviceReady` | The webcam and/or microphone is ready to use. |
| `deviceError` | User doesn't allow the browser to access the webcam and/or microphone. Check `player.deviceErrorCode` for the specific [error code](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia#errorCallback). |
| `startRecord` | User pressed the record or camera button to start recording. |
| `stopRecord` | User pressed the stop button to stop recording. |
| `finishRecord` | The recorded stream or image is available. [Check the](#get-recorded-data) `player.recordedData` object for the recorded data. |
| `enumerateReady` | `enumerateDevices` returned the devices successfully. The list of devices is stored in the `player.recorder.devices` array. |
| `enumerateError` | An error occured after calling `enumerateDevices`. Check the `player.enumerateErrorCode` property for an description of the error. |

Media Constraints
-----------------

[Media stream constraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Parameters)
allow you to specify the types of media to request, along with any requirements
for each type.

The following example shows how to change the camera resolution to 1280 by 720
pixels:

```javascript
var player = videojs("myVideo",
{
    controls: true,
    loop: false,
    // dimensions of video.js player
    width: 1280,
    height: 720,
    plugins: {
        record: {
            maxLength: 5,
            debug: true,
            audio: false,
            video: {
                // video constraints: set resolution of camera
                mandatory: {
                    minWidth: 1280,
                    minHeight: 720,
                },
            },
            // dimensions of captured video frames
            frameWidth: 1280,
            frameHeight: 720
        }
    }
});
```

Get recorded data
-----------------

Listen for the `finishRecord` event and obtain the recorded data from the
`player.recordedData` object for further processing:

```javascript
// user completed recording and stream is available
player.on('finishRecord', function()
{
    // the recordedData object contains the stream data that
    // can be downloaded by the user, stored on server etc.
    console.log('finished recording: ', player.recordedData);
});
```

Note that in the Chrome browser `player.recordedData` returns an object with
`audio` and `video` properties when recording both audio/video. In Firefox
it returns a single WebM Blob object containing both audio and video.

Check the [jquery.fileupload](https://github.com/collab-project/videojs-record/blob/master/examples/upload/jquery.fileupload.html) or [Fine Uploader](https://github.com/collab-project/videojs-record/blob/master/examples/upload/fine-uploader.html)
examples on how to upload the data to a server.

Controlling the input and output devices
----------------------------------------

Use `enumerateDevices` to get a list of the available input and output devices
on the user's system, e.g. `FaceTime HD-camera`, `default (Built-in microphone)`
etc.

Check out the `enumerateDevices` example ([demo](https://collab-project.github.io/videojs-record/examples/enumerate-devices.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/enumerate-devices.html)).

Customizing controls
--------------------

To disable and hide specific controls, use the video.js `controlBar`
option:

```javascript
controlBar: {
    // hide volume and fullscreen controls
    volumeMenuButton: false,
    fullscreenToggle: false
},
```

Other audio libraries
---------------------

RecordRTC is the default recording library but there is also support
for other audio libraries.

### libvorbis.js

Microphone recordings can result in large audio files, especially when there is no native
support for other audio formats (.ogg for example) in the browser (like Chrome).

[libvorbis.js](https://github.com/Garciat/libvorbis.js) provides a Javascript
implementation of a PCM to Ogg Vorbis encoder and you can choose to use this
instead of RecordRTC. libvorbis.js is currently only supported when recording
audio-only.

Include the libvorbis.js library (instead of RecordRTC.js) and place it before
any other scripts:

```html
<script src="/path/to/libvorbis.min.js"></script>
```

Also include the `videojs.record.libvorbis.js` plugin:

```html
<script src="videojs.record.js"></script>
<script src="videojs.record.libvorbis.js"></script>
```

And use `libvorbis.js` for the `audioEngine` option.

Check out the audio-only Ogg example ([demo](https://collab-project.github.io/videojs-record/examples/audio-only-ogg.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/audio-only-ogg.html)).

### lamejs

[lamejs](https://github.com/zhuker/lamejs) provides a Javascript
implementation of a PCM to MP3 encoder and you can choose to use this
instead of RecordRTC. lamejs is currently only supported when recording
audio-only.

Include the `videojs.record.lamejs.js` plugin:

```html
<script src="videojs.record.js"></script>
<script src="videojs.record.lamejs.js"></script>
```

Enable lamejs by specifying the `lamejs` `audioEngine` and the `audioWorkerURL` options.

Check out the audio-only MP3 example ([demo](https://collab-project.github.io/videojs-record/examples/audio-only-mp3.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/audio-only-mp3.html)).

### opus-recorder

[opus-recorder](https://github.com/chris-rudmin/Recorderjs) provides a Javascript
implementation of PCM to Opus encoder and exports it into an Ogg container.
opus-recorder is currently only supported when recording audio-only.

Include the recorder.js script (instead of RecordRTC.js) and place it before
any other scripts:

```html
<script src="/path/to/recorder.js"></script>
```

And include the `videojs.record.opus-recorder.js` plugin:

```html
<script src="videojs.record.js"></script>
<script src="videojs.record.opus-recorder.js"></script>
```

And specify the `opus-recorder` `audioEngine` and `audioWorkerURL` options.

Check out the audio-only Opus example ([demo](https://collab-project.github.io/videojs-record/examples/audio-only-opus.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/audio-only-opus.html)).

### recorder.js

[recorder.js](https://github.com/mattdiamond/Recorderjs) is another plugin for
recording/exporting PCM output of Web Audio API nodes, similar to RecordRTC.
recorder.js is currently only supported when recording audio-only.

Include the recorder.js library (instead of RecordRTC.js) on the page:

```html
<script src="/path/to/recorder.js" async></script>
```

And include the `videojs.record.recorderjs.js` plugin:

```html
<script src="videojs.record.js"></script>
<script src="videojs.record.recorderjs.js"></script>
```

And specify the `recorder.js` `audioEngine` option.

Check out the audio-only recorder.js example ([demo](https://collab-project.github.io/videojs-record/examples/audio-only-recorderjs.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/audio-only-recorderjs.html)).

Localization
------------

This plugin supports multiple languages. Each language has it's own file
(found in the `lang` directory) that contains the translated text.

Using a different language, for example Dutch (`nl`), is done by including
the Video.js language file and the plugin's language file:

```html
<script src="videojs-record/dist/lang/nl.js"></script>
<script src="//vjs.zencdn.net/5.8.7/lang/nl.js"></script>
```

And setting the Video.js player's `language` option:

```javascript
language: "nl"
```

Adding support for an additional language is done by adding a new file with
a filename that consists of the countrycode and the `.json` extension, eg.
`fr.json`. The [build script](#development) compiles the JSON into a usable
language file, eg. `fr.js`. Check the Video.js wiki for a
[list of supported countrycodes](https://github.com/videojs/video.js/blob/master/docs/guides/languages.md#language-codes).
Pull requests to add more languages to this plugin are always welcome!
You can also help out using the Transifex [online translation tool](https://www.transifex.com/collab/videojs-record/).

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

Build a minified version:

```
grunt
```

Generated files are placed in the `dist` directory.

Font
----

Generate or update the font files:

```
grunt font
```

Check the [the font readme](src/css/font/README.md) for more information.

License
-------

This work is licensed under the [MIT License](LICENSE).
