# Hotkeys

The `hotKeys` plugin option (disabled by default) allows you to control this
plugin using a keyboard. 

Note that this requires video.js 7.5.0 or newer.

## Example

- [online demo](https://collab-project.github.io/videojs-record/demo/hot-keys.html)
- [demo source](https://github.com/collab-project/videojs-record/blob/master/examples/hot-keys.html)

## Usage

The built-in hotkey handling is:

| Key | Action | Description |
| :-: | ------ | ----------- |
| `x` | Toggle record | Start/stop recording (or take snapshot in image-only mode) |
| `c` | Toggle playback | Start/stop playback |
| `p` | Toggle picture-in-picture | Enter/exit picture-in-picture mode (if enabled) |

To enable the built-in handler, specify `true` for the `hotKeys` plugin option:

```javascript
record: {
    maxLength: 20,
    debug: true,
    video: true,
    hotKeys: true
}
```

Or use your own handler by specifying a function:

```javascript
record: {
    maxLength: 20,
    debug: true,
    video: true,
    hotKeys: function(event) {
        console.log('pressed key: ' + event.which);

        // check https://github.com/timoxley/keycode for codes
        if (event.which == 88) {
            // toggle record button when pressing 'x' key
            player.recordToggle.trigger('click');
        }
    }
}
```
