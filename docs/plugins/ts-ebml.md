# ts-ebml plugin

[ts-ebml](https://github.com/legokichi/ts-ebml) is an EBML encoder and decoder
for creating seekable webm files, by injecting metadata like duration.

## Example

- [online demo](https://collab-project.github.io/videojs-record/demo/video-only-ebml.html)
- [demo source](https://github.com/collab-project/videojs-record/blob/master/examples/plugins/video-only-ebml.html)

## Usage

Include the `videojs.record.ts-ebml.js` plugin:

```html
<script src="dist/videojs.record.js"></script>
<script src="dist/plugins/videojs.record.ts-ebml.js"></script>
```

And specify the `ts-ebml` `convertEngine` option. For example:

```javascript
record: {
    audio: false,
    video: true,
    maxLength: 20,
    debug: true,
    // enable ts-ebml plugin
    convertEngine: 'ts-ebml'
}
```

## Options

Options for this plugin:

| Option | Value | Description |
| --- | --- | --- |
| `convertEngine` | `ts-ebml` | Enables the plugin. |
