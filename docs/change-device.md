# Change input/output device

## List devices

Use `enumerateDevices` to get a list of the available input and output devices
on the user's system, e.g. `FaceTime HD-camera`, `default (Built-in microphone)`
etc.

### Example

- [online demo](https://collab-project.github.io/videojs-record/demo/enumerate-devices.html)
- [demo source](https://github.com/collab-project/videojs-record/blob/master/examples/enumerate-devices.html)

### Usage

After you acquired the device id (called `deviceID` in the example below) with
`enumerateDevices`, specify it in the player configuration using
[constraints](media-constraints.md):

```javascript
record: {
    maxLength: 20,
    debug: true,
    audio: true,
    video: {
        // video constraints: use preset device
        deviceId: {exact: deviceID}
    }
}
```

## Output devices

### Example

- [online demo](https://collab-project.github.io/videojs-record/demo/change-audio-output.html)
- [demo source](https://github.com/collab-project/videojs-record/blob/master/examples/change-audio-output.html)

### Usage

If your system has multiple audio output devices, use `setAudioOutput(deviceId)` to change
the active audio output device, and listen for the `audioOutputReady` event to be notified
when the new output device is active.

```javascript
player.on('audioOutputReady', function() {
    console.log('Changed audio output to deviceId:', deviceId);
});

// change audio output device
player.record().setAudioOutput(deviceId);
```

## Input devices

If your system has multiple audio input devices and you want to display
these devices and allow the user to choose one, check out this example:

- [online demo](https://collab-project.github.io/videojs-record/demo/change-audio-input.html)
- [demo source](https://github.com/collab-project/videojs-wavesurfer/blob/master/examples/change-audio-input.html)

Similarly, if your system has multiple video input devices and you want the
user to choose one, check out this example:

- [online demo](https://collab-project.github.io/videojs-record/demo/change-video-input.html)
- [demo source](https://github.com/collab-project/videojs-record/blob/master/examples/change-video-input.html)
