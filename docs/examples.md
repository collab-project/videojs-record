# Examples

## Online demos

View the examples online:

| Example | Description | Source |
| --- | --- | --- |
| [Audio/video](https://collab-project.github.io/videojs-record/demo/audio-video.html) | Basic audio/video example | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/audio-video.html) |
| [Video-only](https://collab-project.github.io/videojs-record/demo/video-only.html) | Basic video-only example | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/video-only.html) |
| [Audio-only](https://collab-project.github.io/videojs-record/demo/audio-only.html) | Basic audio-only example | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/audio-only.html) |
| [Image](https://collab-project.github.io/videojs-record/demo/image-only.html) | Basic image example | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/image-only.html) |
| [Screen-only](https://collab-project.github.io/videojs-record/demo/screen-only.html) | Basic screen-only example | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/screen-only.html) |
| [Audio/screen](https://collab-project.github.io/videojs-record/demo/audio-screen.html) | Basic audio/screen example | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/audio-screen.html) |
| [Animated GIF](https://collab-project.github.io/videojs-record/demo/animated-gif.html) | Basic animated GIF example | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/animated-gif.html) |
| [Timeslice](https://collab-project.github.io/videojs-record/demo/timeslice.html) | Get data during recording with specific time-intervals | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/timeslice.html) |
| [Hotkeys](https://collab-project.github.io/videojs-record/demo/hot-keys.html) | Control this plugin using a keyboard | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/hot-keys.html) |
| [Multi](https://collab-project.github.io/videojs-record/demo/multi.html) | Using multiple video.js players on a single page | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/multi.html) |
| [Picture-in-Picture](https://collab-project.github.io/videojs-record/demo/picture-in-picture.html) | Record and playback in a floating window | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/picture-in-picture.html) |
| [Enumerate devices](https://collab-project.github.io/videojs-record/demo/enumerate-devices.html) | List available input and output devices | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/enumerate-devices.html) |
| [Audio output devices](https://collab-project.github.io/videojs-record/demo/change-audio-output.html) | Change audio output device | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/change-audio-output.html) |
| [Audio input devices](https://collab-project.github.io/videojs-record/demo/change-audio-input.html) | Change audio input device | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/change-audio-input.html) |
| [Video input devices](https://collab-project.github.io/videojs-record/demo/change-video-input.html) | Change video input device | [example source](https://github.com/collab-project/videojs-record/blob/master/examples/change-video-input.html) |

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
