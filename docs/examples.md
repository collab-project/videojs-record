# Examples

## Online demos

View the examples online:

| Example | Description | Demo | Source |
| --- | --- | --- | --- |
| **Audio/video** | Basic audio/video example | [online demo](https://collab-project.github.io/videojs-record/demo/audio-video.html) | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/audio-video.html) |
| **Video-only** | Basic video-only example | [online demo](https://collab-project.github.io/videojs-record/demo/video-only.html) | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/video-only.html) |
| **Audio-only** | Basic audio-only example | [online demo](https://collab-project.github.io/videojs-record/demo/audio-only.html) | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/audio-only.html) |
| **Image** | Basic image example | [online demo](https://collab-project.github.io/videojs-record/demo/image-only.html) | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/image-only.html) |
| **Screen-only** | Basic screen-only example | [online demo](https://collab-project.github.io/videojs-record/demo/screen-only.html) | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/screen-only.html) |
| **Audio/screen** | Basic audio/screen example | [online demo](https://collab-project.github.io/videojs-record/demo/audio-screen.html) | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/audio-screen.html) |
| **Animated GIF** | Basic animated GIF example | [online demo](https://collab-project.github.io/videojs-record/demo/animated-gif.html) | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/animated-gif.html) |
| **Timeslice** | Get data during recording with specific time-intervals | [online demo](https://collab-project.github.io/videojs-record/demo/timeslice.html) | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/timeslice.html) |
| **Hotkeys** | Control this plugin using a keyboard | [online demo](https://collab-project.github.io/videojs-record/demo/hot-keys.html) | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/hot-keys.html) |
| **Picture-in-Picture** | Record and playback in a floating window  | [online demo](https://collab-project.github.io/videojs-record/demo/picture-in-picture.html) | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/picture-in-picture.html) |
| **Upload** | Basic upload example | N/A | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/upload/simple.html) |
| **jquery.fileupload** | Upload using jquery.fileupload library | N/A | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/upload/jquery.fileupload.html) |
| **fine-uploader** | Upload using Fine Uploader library | N/A | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/upload/fine-uploader.html) |
| **Enumerate devices** | List available input and output devices | [online demo](https://collab-project.github.io/videojs-record/demo/enumerate-devices.html) | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/enumerate-devices.html) |
| **Audio output devices** | Change audio output device | [online demo](https://collab-project.github.io/videojs-record/demo/change-audio-output.html) | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/change-audio-output.html) |
| **Audio input devices** | Change audio input device | [online demo](https://collab-project.github.io/videojs-record/demo/change-audio-input.html) | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/change-audio-input.html) |
| **Video input devices** | Change video input device | [online demo](https://collab-project.github.io/videojs-record/demo/change-video-input.html) | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/change-video-input.html) |
| **React** | Integrate plugin in a [React](https://reactjs.org) component | [online demo](https://collab-project.github.io/videojs-record/demo/react/index.html) | [example source](https://github.com/collab-project/videojs-record/blob/master/react/index.html) |

## Local setup

To try out the examples locally either:

- download the [zipfile](https://github.com/collab-project/videojs-record/archive/master.zip) and unpack it
- or checkout the repository with Git:
```console
git clone https://github.com/collab-project/videojs-record.git
```

1. Install the dependencies:

```console
cd /path/to/videojs-record
npm install
```

2. Build the library and assets once:

```console
npm run build
```

3. And start the local examples webserver:

```console
npm run start
```

Open http://localhost:8080/examples/ in a browser.
