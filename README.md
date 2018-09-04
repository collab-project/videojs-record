Video.js Record
===============

Video.js plugin for recording audio/video/image files.

![Screenshot](examples/assets/img/screenshot.png?raw=true "Screenshot")

[![npm version](https://img.shields.io/npm/v/videojs-record.svg?style=flat)](https://www.npmjs.com/package/videojs-record)
[![npm](https://img.shields.io/npm/dm/videojs-record.svg)](https://github.com/collab-project/videojs-record/releases)
[![License](https://img.shields.io/npm/l/videojs-record.svg)](LICENSE)
[![Build Status](https://travis-ci.org/collab-project/videojs-record.svg?branch=master)](https://travis-ci.org/collab-project/videojs-record)
[![Coverage Status](https://coveralls.io/repos/github/collab-project/videojs-record/badge.svg?branch=master)](https://coveralls.io/github/collab-project/videojs-record?branch=master)

Table of Contents
-----------------

- [Installation](#installation)
- [Dependencies](#dependencies)
- [Usage](#usage)
  - [Audio/video/image](#audiovideoimage)
  - [Audio-only](#audio-only)
- [Examples](#examples)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [Media constraints](#media-constraints)
- [Get recorded data](#get-recorded-data)
  - [Save data](#save-data)
  - [Timestamps](#timestamps)
  - [Upload data](#upload-data)
- [Controlling the input and output devices](#controlling-the-input-and-output-devices)
- [Responsive layout](#responsive-layout)
- [Customizing controls](#customizing-controls)
- [Other audio libraries](#other-audio-libraries)
- [Localization](#localization)
- [Webpack](#webpack)
- [Using with React](#using-with-react)
- [More features using other plugins](#more-features-using-other-plugins)
- [Development](#development)
- [Font](#font)
- [License](#license)
- [Donate](#donate)

Installation
------------

Use [npm](https://www.npmjs.org) (`npm install videojs-record`) to install the plugin
or [download](https://github.com/collab-project/videojs-record/releases) the library
and dependencies elsewhere. If you want to try the examples, check
[these instructions below](#examples).

Since v2.0 this plugin is compatible with video.js 6.0 and videojs-wavesurfer 2.0 or
newer. If you want to use this plugin with an older version, check the
[archived releases](https://github.com/collab-project/videojs-record/releases?after=1.7.1)
for a 1.7.x or older release.

Take a look at the [changelog](./CHANGES.md) when upgrading from a previous
version of videojs-record.

Dependencies
------------

The plugin has the following mandatory dependencies:

- [Video.js](https://github.com/videojs/video.js) - HTML5 media player that provides the user interface.
- [webrtc-adapter](https://github.com/webrtc/adapter) - Provides cross-browser support for getUserMedia and other browser APIs used in this plugin.

When recording audio and/or video you also need:

- [RecordRTC.js](https://github.com/muaz-khan/RecordRTC) - Adds support for audio/video/GIF recording.

And when recording audio-only, the following dependencies are also required (
to visualize the audio waveform):

- [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js) - Provides a navigable waveform for audio files. Comes with a [microphone plugin](http://wavesurfer-js.org/plugins/microphone.html) used for realtime visualization of the microphone audio signal.
- [videojs-wavesurfer](https://github.com/collab-project/videojs-wavesurfer) - Transforms Video.js into an audio-player.

Optional dependencies when using [other audio libraries](#other-audio-libraries) (note that most of these audio codecs are already available in most modern browsers):

- [libvorbis.js](https://github.com/collab-project/videojs-record/wiki/Plugins#libvorbisjs) - Converts PCM audio data to compressed Ogg Vorbis audio, resulting a smaller audio files with similar quality.
- [lamejs](https://github.com/collab-project/videojs-record/wiki/Plugins#lamejs) - Converts PCM audio data to compressed MP3 audio.
- [opus-recorder](https://github.com/collab-project/videojs-record/wiki/Plugins#opus-recorder) - Converts the output of Web Audio API nodes as Opus and exports it into an Ogg container.
- [recorder.js](https://github.com/collab-project/videojs-record/wiki/Plugins#recorderjs) - A plugin for recording the PCM output of Web Audio API nodes.

Usage
-----

Start by including the video.js stylesheet and library:

```html
<link href="video-js.min.css" rel="stylesheet">
<script src="video.min.js"></script>
```

If you're going to record audio and/or video you need to include RecordRTC as well:

```html
<script src="RecordRTC.js"></script>
```

The videojs-record plugin automatically registers itself when the script
is included on the page:

```html
<script src="videojs.record.js"></script>
```

Add the extra stylesheet for the plugin that includes a
[custom font](font) with additional icons:

```html
<link href="videojs.record.css" rel="stylesheet">
```

### Audio/video/image

When recording either audio/video, video-only, animated GIF or a single image,
include a `video` element:

```html
<video id="myVideo" class="video-js vjs-default-skin"></video>
```

### Audio-only

![Audio-only screenshot](examples/assets/img/audio-only.png?raw=true "Audio-only screenshot")

When recording audio-only, also include the wavesurfer.js library and
the videojs-wavesurfer and microphone plugins. Make sure to place this before
the `videojs.record.js` script.

```html
<script src="wavesurfer.min.js"></script>
<script src="wavesurfer.microphone.min.js"></script>
<script src="videojs.wavesurfer.js"></script>
```

And define an `audio` element:

```html
<audio id="myAudio" class="video-js vjs-default-skin"></audio>
```

There is also support for [additional audio libraries](#other-audio-libraries)
that allows you to record audio with alternative codecs (that otherwise might not
be supported in the browser) like Ogg Vorbis, MP3 and Opus.

Examples
--------

- audio/video ([demo](https://collab-project.github.io/videojs-record/examples/audio-video.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/audio-video.html))
- video-only ([demo](https://collab-project.github.io/videojs-record/examples/video-only.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/video-only.html))
- audio-only example ([demo](https://collab-project.github.io/videojs-record/examples/audio-only.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/audio-only.html))
- image ([demo](https://collab-project.github.io/videojs-record/examples/image-only.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/image-only.html))
- animated GIF ([demo](https://collab-project.github.io/videojs-record/examples/animated-gif.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/animated-gif.html))

To try out the examples locally, download the [zipfile](https://github.com/collab-project/videojs-record/archive/master.zip)
and unpack it, or checkout the repository using Git:

```
git clone https://github.com/collab-project/videojs-record.git
```

And install the dependencies using npm:

```
cd videojs-record
npm install
```

Build the library and assets once:

```
npm run build
```

And start the local webserver:

```
npm run start
```

And open http://localhost:8080/examples/audio-video.html in a browser.

Options
-------

Configure the player using the video.js
[options](https://github.com/videojs/video.js/blob/master/docs/guides/options.md),
and enable the plugin by adding a `record` configuration to `plugins`. For
example:

```javascript
var player = videojs('myVideo', {
    // video.js options
    controls: true,
    loop: false,
    fluid: false,
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
| `animation` | boolean or object | `false` | Animated GIF without audio. |
| `debug` | boolean | `false` | Enables console log messages during recording for debugging purposes. |
| `maxLength` | float | `10` | Maximum length of the recorded clip. |
| `timeSlice` | float | `0` | Accepts numbers in milliseconds; use this to force intervals-based blobs and receive [timestamps](#timestamps) during recording by listening for the `timestamp` event. |
| `autoMuteDevice` | boolean | `false` | Turns off the camera/mic devices (and light) when audio and/or video recording stops, and turns them on again when recording resumes. |
| `frameWidth` | float | `320` | Width of the recorded video frames. Use [media constraints](#media-constraints) to change the camera resolution width. |
| `frameHeight` | float | `240` | Height of the recorded video frames. Use [media constraints](#media-constraints) to change the camera height. |
| `videoMimeType` | string | `'video/webm'` | The mime type for the video recorder. Use `video/mp4` (Firefox) or `video/webm;codecs=H264` (Chrome 52 and newer) for MP4. A full list of supported mime-types in the Chrome browser is listed [here](https://cs.chromium.org/chromium/src/third_party/WebKit/LayoutTests/fast/mediarecorder/MediaRecorder-isTypeSupported.html). |
| `videoRecorderType` | string or function | `'auto'` | Video recorder type to use. This allows you to specify an alternative recorder class, e.g. `WhammyRecorder`. Defaults to `auto` which let's recordrtc specify the best available recorder type. |
| `audioEngine` | string | `'recordrtc'` | Audio recording library/plugin to use. Legal values are `recordrtc`, `libvorbis.js`, `lamejs`, `opus-recorder` and `recorder.js`. |
| `audioRecorderType` | string or function | `'auto'` | Audio recorder type to use. This allows you to specify an alternative recorder class, e.g. `StereoAudioRecorder`. Defaults to `auto` which let's recordrtc specify the best available recorder type. Currently this setting is only used with the `recordrtc` `audioEngine`. |
| `audioMimeType` | string | `'auto'` | The mime type for the audio recorder. Defaults to `auto` which will pick the best option available in the browser (e.g. either `audio/wav`, `audio/ogg` or `audio/webm`). A full list of supported mime-types in the Chrome browser is listed [here](https://cs.chromium.org/chromium/src/third_party/WebKit/LayoutTests/fast/mediarecorder/MediaRecorder-isTypeSupported.html).|
| `audioBufferSize` | float | `4096` | The size of the audio buffer (in sample-frames per second). Legal values: 0, 256, 512, 1024, 2048, 4096, 8192 and 16384. |
| `audioSampleRate` | float | `44100` | The audio sample rate (in sample-frames per second) at which the `AudioContext` handles audio. Legal values are in the range of 22050 to 96000. |
| `audioBitRate` | float | `128` | The audio bitrate in kbps (only used in the lamejs plugin). |
| `audioChannels` | float | `2` | Number of audio channels. Using a single channel results in a smaller filesize. |
| `audioWorkerURL` | string | `''` | URL for the audio worker, for example: `/opus-recorder/build/encoderWorker.min.js`. Currently only used for opus-recorder and lamejs plugins. |
| `animationFrameRate` | float | `200` | Frame rate for animated GIF (in frames per second). |
| `animationQuality` | float | `10` | Sets quality of color quantization (conversion of images to the maximum 256 colors allowed by the GIF specification). Lower values (minimum = 1) produce better colors, but slow processing significantly. The default produces good color mapping at reasonable speeds. Values greater than 20 do not yield significant improvements in speed. |

Methods
-------

Methods for this plugin documented below are available using the `record` method
of the video.js player instance. For example:

```javascript
player.record().destroy();
```

| Method | Description |
| --- | --- |
| `isRecording` | Returns a boolean indicating whether recording is active or not. |
| `getRecordType` | Get recorder type as string. Either `image_only`, `animation`, `audio_only`, `video_only` or `audio_video`. |
| `saveAs` | Show save as dialog in browser so the user can [store the recorded media locally](#save-data). |
| `destroy` | Destroys the recorder instance and children (including the video.js player). |
| `reset` | Not as destructive as `destroy`: use this if you want to reset the player interface and recorder state. |
| `stopDevice` | Stop the recording and the active audio and/or video device(s). |
| `getDevice` | Start the audio and/or video device(s). |
| `getDuration` | Get the length of the recorded stream in seconds. Returns 0 if no recording is available (yet). |
| `getCurrentTime` | Get the current time of the recorded stream during playback. Returns 0 if no recording is available (yet). |
| `enumerateDevices` | [Get async list of media input and output devices](#controlling-the-input-and-output-devices) available on the system. |
| `setAudioOutput(deviceId)` | Change the audio output device using its [deviceId](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo/deviceId). |
| `start` | Start recording. |
| `stop` | Stop recording. |
| `pause` | Pause recording. |
| `resume` | Resume recording. |

Events
------

Plugin events that are available on the video.js player instance. For example:

```javascript
player.on('startRecord', function() {
    console.log('started recording!');
});
```

| Event | Description |
| --- | --- |
| `deviceReady` | The webcam and/or microphone is ready to use. |
| `deviceError` | User doesn't allow the browser to access the webcam and/or microphone. Check `player.deviceErrorCode` for the specific [error code](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia#errorCallback). |
| `startRecord` | User pressed the record or camera button to start recording. |
| `progressRecord` | Fires continuously during recording (until recording is stopped or paused). |
| `stopRecord` | User pressed the stop button to stop recording. |
| `timestamp` | Fires continuously during recording [whenever a new timestamp is available](#timestamps). Only fires if the `timeSlice` option is set. |
| `finishRecord` | The recorded stream or image is available. [Check the](#get-recorded-data) `player.recordedData` object for the recorded data. |
| `enumerateReady` | `enumerateDevices` returned the devices successfully. The list of devices is stored in the `player.record().devices` array. |
| `enumerateError` | An error occured after calling `enumerateDevices`. Check the `player.enumerateErrorCode` property for an description of the error. |
| `audioOutputReady` | Audio output was changed and is now active. |

Media constraints
-----------------

[Media stream constraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Parameters)
allow you to specify the types of media to request, along with any requirements
for each type.

The following example shows how to change the camera resolution to 1280 by 720
pixels:

```javascript
var player = videojs('myVideo', {
    controls: true,
    loop: false,
    // dimensions of video.js player
    fluid: false,
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
player.on('finishRecord', function() {
    // the recordedData object contains the stream data that
    // can be downloaded by the user, stored on server etc.
    console.log('finished recording: ', player.recordedData);
});
```

### Save data

Use the `saveAs` method to show a 'Save as' browser dialog where the user can
choose the storage location for the recorded data. It accepts a `name` object that
contains a mapping between the media type and the filename. For example:

```javascript
player.on('finishRecord', function() {
    // show save as dialog
    player.record().saveAs({'video': 'my-video-file-name.webm'});
});
```

### Timestamps

It's also possible to get data during recording with specific time-intervals. This could
be useful in scenarios where you're recording a long clip and planning to upload
recorded blobs to a server periodically, where the clip is stiched it together.

Enable the event with the `timeSlice` option:

```javascript
record: {
    audio: false,
    video: true,
    maxLength: 5,
    debug: true,
    // fire the timestamp event every 2 seconds
    timeSlice: 2000
}
```

And listen for the `timestamp` event. For example:

```javascript
// monitor stream data during recording
player.on('timestamp', function() {
    // timestamps
    console.log('current timestamp: ', player.currentTimestamp);
    console.log('all timestamps: ', player.allTimestamps);

    // stream data
    console.log('array of blobs: ', player.recordedData);
    // or construct a single blob:
    // var blob = new Blob(blobs, {
    //     type: 'video/webm'
    // });
});
```

### Upload data

The example below shows how to upload each recording:

```javascript
player.on('finishRecord', function() {
    // the blob object contains the recorded data that
    // can be downloaded by the user, stored on server etc.
    console.log('finished recording:', player.recordedData);

    var data = player.recordedData;
    var serverUrl = '/upload';
    var formData = new FormData();
    formData.append('file', data, data.name);

    console.log('uploading recording:', data.name);

    fetch(serverUrl, {
        method: 'POST',
        body: formData
    }).then(
        success => console.log('recording upload complete.')
    ).catch(
        error => console.error('an upload error occurred!')
    );
});
```

Check the [simple upload](https://github.com/collab-project/videojs-record/blob/master/examples/upload/simple.html)
for the complete example.

The example below shows how to 'stream' upload recorded data segments to a server
using the [jQuery](http://jquery.com/) library and the `timestamp` event:

```javascript
var segmentNumber = 0;

player.on('timestamp', function() {
    if (player.recordedData && player.recordedData.length > 0) {
        var binaryData = player.recordedData[player.recordedData.length - 1];

        segmentNumber++;

        var formData = new FormData();
        formData.append('SegmentNumber', segmentNumber);
        formData.append('Data', binaryData);

        $.ajax({
            url: '/api/Test',
            method: 'POST',
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log("segment: " + segmentNumber);
            }
        });
    }
});
```

Check the [jquery.fileupload](https://github.com/collab-project/videojs-record/blob/master/examples/upload/jquery.fileupload.html) or
[Fine Uploader](https://github.com/collab-project/videojs-record/blob/master/examples/upload/fine-uploader.html)
examples on how to upload the data to a server using these libraries.

Controlling the input and output devices
----------------------------------------

Use `enumerateDevices` to get a list of the available input and output devices
on the user's system, e.g. `FaceTime HD-camera`, `default (Built-in microphone)`
etc.

Check out the `enumerateDevices` example
([demo](https://collab-project.github.io/videojs-record/examples/enumerate-devices.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/enumerate-devices.html)).

After you aquired the device id (called `deviceId` in the example below) specify it in the player configuration
using [constraints](#media-constraints):

```javascript
record: {
    maxLength: 20,
    debug: true,
    audio: true,
    video: {
        // video constraints: use preset device
        optional: [{sourceId: deviceId}]
    },
}
```

If your device has multiple audio output devices, use `setAudioOutput(deviceId)` to change
the active audio output device, and listen for the `audioOutputReady` event to be notified
when the new output device is active.

```javascript
player.on('audioOutputReady', function() {
    console.log('Changed audio output to deviceId:', deviceId);
});

// change audio output device
player.record().setAudioOutput(deviceId);
```

See the full `change-audio-output` example
([demo](https://collab-project.github.io/videojs-record/examples/change-audio-output.html) or
[source](https://github.com/collab-project/videojs-record/blob/master/examples/change-audio-output.html)).

If your device has multiple audio input devices and you want to display
these devices and allow the user to choose one, check out the the full `change-audio-input` example
([demo](https://collab-project.github.io/videojs-record/examples/change-audio-input.html) or
[source](https://github.com/collab-project/videojs-record/blob/master/examples/change-audio-input.html)).


Responsive layout
-----------------

The `fluid` option for video.js will resize the player according to the size
of the window.

Configure the player; enable the video.js `'fluid'` option:

```javascript
fluid: true
```

Customizing controls
--------------------

To disable and hide specific controls, use the video.js `controlBar`
option:

```javascript
controlBar: {
    // hide fullscreen and volume controls
    fullscreenToggle: false,
    volumePanel: false
},
```

Other audio libraries
---------------------

RecordRTC is the default recording library but there is also support
for other audio libraries. Check the
[plugins](https://github.com/collab-project/videojs-record/wiki/Plugins) wiki
page for more information.

Localization
------------

This plugin supports multiple languages. Each language has it's own file
(found in the `src/lang` directory) that contains the translated text.

Using a different language, for example Dutch (`nl`), is done by including
the plugin's language file and the Video.js language file:

```html
<script src="videojs-record/dist/lang/nl.js"></script>
<script src="video.js/dist/lang/nl.js"></script>
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

Using with React
----------------

The React [wiki page](https://github.com/collab-project/videojs-record/wiki/React) wiki page
shows how to get started with React and videojs-record using the
[create-react-app](https://github.com/facebook/create-react-app) tool.

Alternatively, the `react` example shows how to integrate this plugin in a [React](https://reactjs.org) component
([demo](https://collab-project.github.io/videojs-record/examples/react/index.html) or
[source](https://github.com/collab-project/videojs-record/blob/master/examples/react/index.html)).

Webpack
-------

The [webpack](https://github.com/collab-project/videojs-record/wiki/Webpack) wiki page shows how to configure webpack for videojs-record.

More features using other plugins
---------------------------------

The Video.js community created
[lots of plugins](https://github.com/videojs/video.js/wiki/Plugins)
that can be used to enhance the player's functionality.

Development
-----------

Install dependencies using npm:

```
npm install
```

Build a minified version:

```
npm run build
```

Generated files are placed in the `dist` directory.

During development:

```
npm run start
```

This will watch the source directory and rebuild when any changes
are detected. It will also serve the files on http://127.0.0.1:8080.

All commands for development are listed in the `package.json` file and
are run using:

```
npm run <command>
```

Font
----

Check the [the font readme](src/fonts/README.md) for more information.

License
-------

This work is licensed under the [MIT License](LICENSE).

Donate
------

Please consider donating if you like this project. Bitcoin is accepted
and can be sent to `3PmXCqUggtq7KUWPbpN8WhMnb1Mfb1jbq8`.
