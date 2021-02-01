# Customizing controls

## Control bar

To disable and hide specific controls, use the video.js `controlBar`
option:

```javascript
let options = {
    controls: true,
    bigPlayButton: false,
    controlBar: {
        // hide fullscreen and volume controls
        fullscreenToggle: false,
        volumePanel: false
    },
    width: 320,
    height: 240,
    plugins: {
        // videojs-record plugin options
        record: {
            audio: false,
            video: true,
            maxLength: 5,
            debug: true,
            displayMilliseconds: true
        }
    }
};
```

Custom interface elements for this library that can be hidden are:

- `deviceButton`
- `recordIndicator`
- `cameraButton`
- `pipToggle`
- `recordToggle`

For more information, see the video.js [component options](https://github.com/videojs/video.js/blob/master/docs/guides/options.md#component-options).


## Time format

The default time format is `HH:MM` or `MM:SS`. Set the `displayMilliseconds` to `true` to change
the format to `MM:SS:MMM`.

Use the `formatTime` option if you need more control over the format. For example:

```javascript
let options = {
    // ...
    plugins: {
        record: {
            audio: false,
            video: true,
            maxLength: 5,
            formatTime: (seconds, guide) => `bar:${seconds}:${guide}`,
            debug: true
        }
    }
};
```

Use `setFormatTime(func)` if you want to change the time format during runtime:

```javascript
player.record().setFormatTime(
    (seconds, guide) => `bar:${seconds}:${guide}`
);
```
