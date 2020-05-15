# Customizing controls

To disable and hide specific controls, use the video.js `controlBar`
option:

```javascript
controlBar: {
    // hide fullscreen and volume controls
    fullscreenToggle: false,
    volumePanel: false
}
```

Custom interface elements for this library that can be hidden are:

- `deviceButton`
- `recordIndicator`
- `cameraButton`
- `pipToggle`
- `recordToggle`

For more information, see the video.js [component options](https://github.com/videojs/video.js/blob/master/docs/guides/options.md#component-options).
