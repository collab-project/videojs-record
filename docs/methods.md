# Methods

Methods for this plugin are documented below. These are available on the
`record` plugin instance of the video.js player.

For example:

```javascript
player.record().destroy();
```

| Method | Description |
| --- | --- |
| `isRecording` | Returns a boolean indicating whether recording is active or not. |
| `getRecordType` | Get recorder type as string. Either `image_only`, `animation`, `audio_only`, `video_only`, `audio_video`, `screen_only` or `audio_screen`. |
| `saveAs` | Show save as dialog in browser so the user can [store the recorded media locally](recorded-data#save-data). |
| `destroy` | Destroys the recorder instance and children (including the video.js player). |
| `reset` | Not as destructive as `destroy`: use this if you want to reset the player interface and recorder state. |
| `stopDevice` | Stop the recording and the active audio and/or video device(s). |
| `getDevice` | Start the audio and/or video device(s). |
| `getDuration` | Get the length of the recorded stream in seconds. Returns 0 if no recording is available (yet). |
| `getCurrentTime` | Get the current time of the recorded stream during playback. Returns 0 if no recording is available (yet). |
| `enumerateDevices` | [Get async list of media input and output devices](change-device.md) available on the system. |
| `setAudioOutput(deviceId)` | Change the audio output device using its [deviceId](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo/deviceId). |
| `setAudioInput(deviceId)` | Change the audio input device using its [deviceId](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo/deviceId). |
| `setVideoInput(deviceId)` | Change the video input device using its [deviceId](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo/deviceId). |
| `start` | Start recording. |
| `stop` | Stop recording. |
| `pause` | Pause recording. |
| `resume` | Resume recording. |

All public methods are documented in the online [API documentation](https://collab-project.github.io/videojs-record/api/).
