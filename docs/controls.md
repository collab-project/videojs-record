# Customizing controls

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
            debug: true
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
