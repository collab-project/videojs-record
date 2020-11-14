# Events

The events for this plugin are available on the video.js player instance.

For example:

```javascript
player.on('startRecord', function() {
    console.log('started recording!');
});
```

| Event | Description |
| --- | --- |
| `deviceReady` | The webcam and/or microphone is ready to use. |
| `deviceError` | User doesn't allow the browser to access the webcam and/or microphone. Check `player.deviceErrorCode` for the specific [error code](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia#errorCallback). |
| `startRecord` | User pressed the record or camera button to start recording. |
| `progressRecord` | Fires continuously during recording (until recording is stopped or paused). |
| `stopRecord` | User pressed the stop button to stop recording. |
| `timestamp` | Fires continuously during recording [whenever a new timestamp is available](recorded-data#timestamps). Only fires if the `timeSlice` option is set. |
| `finishRecord` | The recorded stream or image is available. Inspect the [player.recordedData](recorded-data.md) object for the recorded data. |
| `enumerateReady` | `enumerateDevices` returned the devices successfully. The list of devices is stored in the `player.record().devices` array. |
| `enumerateError` | An error occurred after calling `enumerateDevices`. Check the `player.enumerateErrorCode` property for an description of the error. |
| `audioOutputReady` | Audio output was changed and is now active. |
| `audioBufferUpdate` | Get real-time `AudioBuffer` instances from microphone. Fires continuously during audio-only recording (until recording is stopped or paused) when the `audioBufferUpdate` option is enabled. |
| `enterPIP` | Entered [Picture-in-Picture](picture-in-picture.md) mode. |
| `leavePIP` | Left [Picture-in-Picture](picture-in-picture.md) mode. |
| `startConvert` | The convert plugin started processing the recorded data. |
| `finishConvert` | The converted data is available. Inspect the [player.convertedData](recorded-data#convert-data) object for the converted data. |
| `retry` | User clicked on `retry` to take another picture. Only available for image-only mode. |
