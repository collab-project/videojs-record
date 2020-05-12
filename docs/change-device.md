# Controlling the input and output devices

Use `enumerateDevices` to get a list of the available input and output devices
on the user's system, e.g. `FaceTime HD-camera`, `default (Built-in microphone)`
etc.

Check out the `enumerateDevices` example
([demo](https://collab-project.github.io/videojs-record/examples/enumerate-devices.html) / [source](https://github.com/collab-project/videojs-record/blob/master/examples/enumerate-devices.html)).

After you acquired the device id (called `deviceId` in the example below) specify it in the player configuration
using [constraints](#media-constraints):

```javascript
record: {
    maxLength: 20,
    debug: true,
    audio: true,
    video: {
        // video constraints: use preset device
        deviceId: {exact: deviceId}
    }
}
```

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

See the full `change-audio-output` example
([demo](https://collab-project.github.io/videojs-record/examples/change-audio-output.html) or
[source](https://github.com/collab-project/videojs-record/blob/master/examples/change-audio-output.html)).

If your system has multiple audio input devices and you want to display
these devices and allow the user to choose one, check out the the full `change-audio-input` example
([demo](https://collab-project.github.io/videojs-record/examples/change-audio-input.html) or
[source](https://github.com/collab-project/videojs-record/blob/master/examples/change-audio-input.html)).

Similarly, if your system has multiple video input devices and you want the
user to choose one, check out the `change-video-input` example
([demo](https://collab-project.github.io/videojs-record/examples/change-video-input.html) or
[source](https://github.com/collab-project/videojs-record/blob/master/examples/change-video-input.html)).
