# Options

Configure the player with:

- [video.js options](https://github.com/videojs/video.js/blob/master/docs/guides/options.md)

When using audio-only or audio/screen:

- [wavesurfer.js options](https://wavesurfer-js.org/docs/options.html)

Additional options for this plugin are:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `image` | boolean or object | `false` | Create single snapshot image. |
| `audio` | boolean or object | `false` | Include audio in the recorded clip. |
| `video` | boolean or object | `false` | Include video in the recorded clip. |
| `animation` | boolean or object | `false` | Animated GIF without audio. |
| `screen` | boolean or object | `false` | Include screen capture in the recorded clip. |
| `debug` | boolean | `false` | Enables console log messages during recording for debugging purposes. |
| `pip` | boolean | `false` | Enables [Picture-in-Picture support](picture-in-picture.md). Enable to add Picture-in-Picture button to controlbar. |
| `maxLength` | float | `10` | Maximum length of the recorded clip. |
| `maxFileSize` | float | `0` | Maximum file size of a recorded clip (in bytes). Recording will stop when the limit is reached. Default is 0 (no file size limit). Can only be used when `timeSlice` option is also enabled. |
| `displayMilliseconds` | boolean | `false` | Indicates if milliseconds should be included in time displays, e.g. `00:00:000` vs `00:00`. |
| `timeSlice` | float | `0` | Accepts numbers in milliseconds; use this to force intervals-based blobs and receive [timestamps](recorded-data#timestamps) during recording by listening for the `timestamp` event. |
| `autoMuteDevice` | boolean | `false` | Turns off the camera/microphone devices (and light) when audio and/or video recording stops, and turns them on again when recording resumes. |
| `frameWidth` | float | `320` | Width of the recorded video frames. Use [media constraints](media-constraints.md) to change the camera resolution width. |
| `frameHeight` | float | `240` | Height of the recorded video frames. Use [media constraints](media-constraints.md) to change the camera height. |
| `imageOutputType` | string | `'dataURL'` | Image output **type**. Legal values are `dataURL` (base64 string) or `blob`. |
| `imageOutputFormat` | string | `'image/png'` | Image output **format**. Only used if `imageOutputType` equals to `dataURL`. |
| `imageOutputQuality` | float | `0.92` | Image output **quality**. Only used if `imageOutputType` equals to `dataURL`. |
| `videoEngine` | string | `'recordrtc'` | Video recording library/plugin to use. Legal values are `recordrtc` and `webm-wasm`. |
| `videoMimeType` | string | `'video/webm;codecs=vp8'` | The mime type for the video recorder. Use `video/mp4` (Firefox) or `video/webm;codecs=H264` (Chrome 52 and newer) for MP4. A full list of supported MediaRecorder mime-types in the Chrome browser is listed [here](https://cs.chromium.org/chromium/src/third_party/blink/web_tests/fast/mediarecorder/MediaRecorder-isTypeSupported.html) ([browser test](https://www.webrtc-experiment.com/RecordRTC/simple-demos/isTypeSupported.html)). |
| `videoRecorderType` | string or function | `'auto'` | Video recorder type to use. This allows you to specify an alternative recorder class, e.g. `WhammyRecorder`. Defaults to `auto` which let's recordrtc specify the best available recorder type. |
| `videoBitRate` | float | `1200` |  The video bitrate in kbps (only used in webm-wasm plugin). |
| `videoFrameRate` | float | `30` |  The video frame rate in frames per second (only used in webm-wasm plugin). |
| `videoWorkerURL` | string | `''` | URL for the video worker, for example: `../node_modules/webm-wasm/dist/webm-worker.js`. Currently only used for the webm-wasm plugin. Use an empty string '' to disable (default). |
| `videoWebAssemblyURL` | string | `''` | URL for the video worker WebAssembly file. Use an empty string '' to disable (default). Currently only used for the webm-wasm plugin. |
| `audioEngine` | string | `'recordrtc'` | Audio recording library/plugin to use. Legal values are `recordrtc`, `libvorbis.js`, `vmsg`, `opus-recorder`,  `opus-media-recorder`, `lamejs` and `recorder.js`. |
| `audioRecorderType` | string or function | `'auto'` | Audio recorder type to use. This allows you to specify an alternative recorder class, e.g. `StereoAudioRecorder`. Defaults to `auto` which let's recordrtc specify the best available recorder type. Currently this setting is only used with the `recordrtc` `audioEngine`. |
| `audioMimeType` | string | `'auto'` | The mime type for the audio recorder. Defaults to `auto` which will pick the best option available in the browser (e.g. either `audio/wav`, `audio/ogg` or `audio/webm`). A full list of supported mime-types in the Chrome browser is listed [here](https://cs.chromium.org/chromium/src/third_party/blink/web_tests/fast/mediarecorder/MediaRecorder-isTypeSupported.html).|
| `audioBufferSize` | float | `4096` | The size of the audio buffer (in sample-frames per second). Legal values: 0, 256, 512, 1024, 2048, 4096, 8192 and 16384. |
| `audioSampleRate` | float | `44100` | The audio sample rate (in sample-frames per second) at which the `AudioContext` handles audio. Legal values are in the range of 22050 to 96000. |
| `audioBitRate` | float | `128` | The audio bitrate in kbps (only used in the lamejs plugin). |
| `audioChannels` | float | `2` | Number of audio channels. Using a single channel results in a smaller file size. |
| `audioWorkerURL` | string | `''` | URL for the audio worker, for example: `/opus-recorder/build/encoderWorker.min.js`. Currently only used for opus-recorder, opus-media-recorder and lamejs plugins. Use an empty string '' to disable (default). |
| `audioWebAssemblyURL` | string | `''` | URL for the audio worker WebAssembly file. Use an empty string '' to disable (default). Currently only used for the vmsg and opus-media-recorder plugins. |
| `audioBufferUpdate` | boolean | `false` | Enables the `audioBufferUpdate` event that provides real-time `AudioBuffer` instances from the input audio device. |
| `animationFrameRate` | float | `200` | Frame rate for animated GIF (in frames per second). |
| `animationQuality` | float | `10` | Sets quality of color quantization (conversion of images to the maximum 256 colors allowed by the GIF specification). Lower values (minimum = 1) produce better colors, but slow processing significantly. The default produces good color mapping at reasonable speeds. Values greater than 20 do not yield significant improvements in speed. |
| `convertEngine` | string | `''` | Media converter library to use. Legal values are `ts-ebml`, `ffmpeg.wasm` and `ffmpeg.js`. Use an empty string `''` to disable (default). Inspect the [player.convertedData](recorded-data#convert-data) object for the converted data. |
| `convertWorkerURL` | string | `''` | URL for the converter worker, for example: `/node_modules/ffmpeg.js/ffmpeg-worker-mp4.js`. Currently only used for ffmpeg.wasm and ffmpeg.js plugins. Use an empty string '' to disable (default). |
| `convertOptions` | array | `[]` | List of string options to pass to the convert engine. |
| `hotKeys` | boolean or function | `false` | Enable [keyboard hotkeys](hotkeys.md). Disabled by default. |
| `pluginLibraryOptions` | object | `{}` | Use this object to specify additional settings for the library used by the plugin. Currently only used for the ffmpeg.wasm, ffmpeg.js, opus-recorder and vmsg plugins. |
