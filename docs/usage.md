# Usage

## Setup
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

## Audio/video/image/screen

When recording either audio/video, video-only, screen-only, audio/screen, animated GIF or a single image,
include a `video` element:

```html
<video id="myVideo" playsinline class="video-js vjs-default-skin"></video>
```

## Audio-only

![Audio-only screenshot](img/audio-only.png?raw=true "Audio-only screenshot")

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

There is also support for additional [audio plugins](audio-plugins.md)
that allows you to record audio with alternative codecs (that otherwise might not
be supported in the browser) like Ogg Vorbis, MP3 and Opus.

## Configuration

Define the player configuration and enable the videojs-record plugin by adding a `record` entry:


```javascript
let options = {
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
};
```

Finally, create the player:


```javascript
let player = videojs('myVideo', options, function() {
    // print version information at startup
    const msg = 'Using video.js ' + videojs.VERSION +
        ' with videojs-record ' + videojs.getPluginVersion('record');
    videojs.log(msg);
});
```

Check the [options](options.md), [methods](methods.md) and [events](events.md) documentation
for more information.
