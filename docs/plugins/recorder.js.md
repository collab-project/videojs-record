# recorder.js plugin

[recorder.js](https://github.com/mattdiamond/Recorderjs) is another plugin for
recording/exporting PCM output of Web Audio API nodes, similar to RecordRTC.
recorder.js is currently only supported when recording audio-only.

Note that this plugin is deprecated because recorder.js is an unmaintained library.

## Example

- [online demo](https://collab-project.github.io/videojs-record/demo/audio-only-recorderjs.html)
- [demo source](https://github.com/collab-project/videojs-record/blob/master/examples/plugins/audio-only-recorderjs.html)

## Usage

Install the library:

```console
npm install --save git+https://github.com/mattdiamond/Recorderjs.git
```

Include the recorder.js script on the page:

```html
<script src="recorderjs/dist/recorder.js"></script>
```

Import the plugin:

```javascript
import RecorderjsEngine from 'videojs-record/dist/plugins/videojs.record.recorderjs.js';
```

And specify the `recorder.js` `audioEngine` option:

```javascript
record: {
    audio: true,
    video: false,
    maxLength: 20,
    debug: true,
    audioEngine: 'recorder.js'
}
```

## Options

Options for this plugin:

| Option | Value | Description |
| --- | --- | --- |
| `audioEngine` | `recorder.js` | Enables the plugin. |
