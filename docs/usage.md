# Usage

## Setup
Start by importing the video.js stylesheet and library:

```javascript
import 'video.js/dist/video-js.min.css';
import videojs from 'video.js';
```

If you're going to record audio and/or video you need RecordRTC as well:

```javascript
import RecordRTC from 'recordrtc';
```

Add the extra stylesheet for the plugin that includes a
[custom font](font) with additional icons:

```javascript
import 'videojs-record/dist/css/videojs.record.css';
```

The videojs-record plugin will automatically register itself after importing
it:

```javascript
import Record from 'videojs-record/dist/videojs.record.js';
```

## Audio/video/image/screen

When recording either audio/video, video-only, screen-only, audio/screen,
animated GIF or a single image, include a `video` element:

```html
<video id="myVideo" playsinline class="video-js vjs-default-skin"></video>
```

## Audio-only

![Audio-only screenshot](img/audio-only.png?raw=true "Audio-only screenshot")

When recording audio-only, also include the wavesurfer.js library and
the videojs-wavesurfer and microphone plugins. Make sure to import
these libraries before videojs-record.

```javascript
// the following imports are only needed when you're recording
// audio-only using the videojs-wavesurfer plugin
import WaveSurfer from 'wavesurfer.js';
import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';
WaveSurfer.microphone = MicrophonePlugin;

// register videojs-wavesurfer plugin
import 'videojs-wavesurfer/dist/css/videojs.wavesurfer.css';
import Wavesurfer from 'videojs-wavesurfer/dist/videojs.wavesurfer.js';
```

And define an `audio` element:

```html
<audio id="myAudio" class="video-js vjs-default-skin"></audio>
```

There is also support for additional [audio plugins](plugins.md#audio)
that allows you to record audio with alternative codecs (that otherwise might not
be supported in the browser) like Ogg Vorbis, MP3 and Opus.

## Configuration

Define the player configuration and enable the videojs-record plugin by adding
a `record` entry:

```javascript
let options = {
    // video.js options
    controls: true,
    bigPlayButton: false,
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
            displayMilliseconds: true,
            debug: true
        }
    }
};
```

Finally, create the player:

```javascript
let player = videojs('myVideo', options, function() {
    // print version information at startup
    const msg = 'Using video.js ' + videojs.VERSION +
        ' with videojs-record ' + videojs.getPluginVersion('record');
    videojs.log(msg);

    console.log("videojs-record is ready!");
});
```

Check the [options](options.md), [methods](methods.md) and [events](events.md) documentation
for more information.
