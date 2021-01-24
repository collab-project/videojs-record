# opus-media-recorder plugin

[opus-media-recorder](https://github.com/chris-rudmin/Recorderjs) provides a Javascript
implementation of PCM to Opus encoder and exports it into an Ogg container.
opus-recorder is currently only supported when recording audio-only.

## Example

- [online demo](https://collab-project.github.io/videojs-record/demo/audio-only-opus-media-recorder.html)
- [demo source](https://github.com/collab-project/videojs-record/blob/master/examples/plugins/audio-only-opus-media-recorder.html)

## Usage

Install the library:

```console
npm install --save opus-media-recorder
```

Include the opus-media-recorder script and place it before any other scripts:

```html
<script src="opus-recorder/dist/recorder.min.js"></script>
```

Import the plugin:

```javascript
import OpusMediaRecorderEngine from 'videojs-record/dist/plugins/videojs.record.opus-media-recorder.js';
```

And specify the `opus-media-recorder` `audioEngine` and `audioWorkerURL` options.
Use the `pluginLibraryOptions` option to specify optional settings for the opus-media-recorder library.

For example:

```javascript
record: {
    audio: true,
    video: false,
    maxLength: 20,
    debug: true,
    audioEngine: 'opus-recorder',
    audioSampleRate: 48000,
    audioChannels: 1,
    audioWorkerURL: '../../node_modules/opus-media-recorder/encoderWorker.umd.js'
    // use the pluginLibraryOptions option to specify optional settings for the
    // opus-recorder library. For example:
    // pluginLibraryOptions: {
    //    monitorGain: 0.4,
    //    originalSampleRateOverride: 16000
    // }
}
```

## Options

Options for this plugin:

| Option | Value | Description |
| --- | --- | --- |
| `audioEngine` | `opus-media-recorder` | Enables the plugin. |
| `audioWorkerURL` | `/path/to/encoderWorker.umd.js` | Path to encoder WebWorker file. |
| `audioSampleRate` | `48000` | The audio sample rate (in sample-frames per second) at which the `AudioContext` handles audio. Legal values are in the range of 22050 to 96000. |
| `audioChannels` | `1` | Number of audio channels. Using a single channel results in a smaller file size. |
| `pluginLibraryOptions` | `{}` | Specify optional settings for the opus-recorder library. |
