# Hotkeys

The `hotKeys` plugin option allows you to control this plugin using a keyboard (disabled
by default). Note that this requires video.js 7.5.0 or newer.

The built-in hotkey handling is:

| Key | Action | Description |
| :-: | ------ | ----------- |
| `x` | toggle record | start/stop recording (or take snapshot in image-only mode)
| `c` | toggle playback | start/stop playback
| `p` | toggle picture-in-picture | enter/exit picture-in-picture mode (if enabled)

To enable the built-in handler, specify `true` for the `hotKeys` plugin option:

```javascript
record: {
    maxLength: 20,
    debug: true,
    video: true,
    hotKeys: true
},
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
},
```

Check out the `hot-keys` example
([demo](https://collab-project.github.io/videojs-record/examples/hot-keys.html) or
[source](https://github.com/collab-project/videojs-record/blob/master/examples/hot-keys.html)).
