# libvorbis.js plugin

Microphone recordings can result in large audio files, especially when there is
no native support for other audio formats (.ogg for example) in the browser
(like Chrome).

[libvorbis.js](https://github.com/Garciat/libvorbis.js) provides a Javascript
implementation of a PCM to Ogg Vorbis encoder and you can choose to use this
instead of RecordRTC. libvorbis.js is currently only supported when recording
audio-only.

## Example

- [online demo](https://collab-project.github.io/videojs-record/demo/audio-only-ogg.html)
- [demo source](https://github.com/collab-project/videojs-record/blob/master/examples/plugins/audio-only-ogg.html)

## Usage

Include the libvorbis.js script and place it before any other scripts:

```html
<script src="libvorbis.min.js"></script>
```

Also include the `videojs.record.libvorbis.js` plugin:

```html
<script src="dist/videojs.record.js"></script>
<script src="dist/plugins/videojs.record.libvorbis.js"></script>
```

And use `libvorbis.js` for the `audioEngine` option:

```javascript
record: {
    audio: true,
    video: false,
    maxLength: 20,
    debug: true,
    audioEngine: 'libvorbis.js',
    audioSampleRate: 32000
}
```

## Options

Options for this plugin:

| Option | Value | Description |
| --- | --- | --- |
| `audioEngine` | `libvorbis.js` | Enables the plugin. |
| `audioSampleRate` | `32000` | The audio sample rate (in sample-frames per second) at which the `AudioContext` handles audio. Legal values are in the range of 22050 to 96000. |
