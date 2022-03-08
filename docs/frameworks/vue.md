# Vue.js

This page shows how to get started with [Vue.js](https://vuejs.org/) and videojs-record.

For more information, check the video.js [documentation](https://github.com/videojs/video.js/blob/master/docs/guides/vue.md)
for Vue.js.

## Installation

Install the [Vue.js CLI](https://cli.vuejs.org/guide/) globally:

```console
npm install -g @vue/cli
```

Create a new application, e.g. `videojs-record-vue`:

```console
vue create --default --packageManager npm videojs-record-vue
```

Install videojs-record:

```console
cd videojs-record-vue
npm install --save videojs-record
```

## Application

Create `src/components/VideoJSRecord.vue`:

```html
<template>
    <video id="myVideo" class="video-js vjs-default-skin" playsinline></video>
</template>

<script>
    /* eslint-disable */
    import 'video.js/dist/video-js.css'
    import 'videojs-record/dist/css/videojs.record.css'
    import videojs from 'video.js'

    import 'webrtc-adapter'
    import RecordRTC from 'recordrtc'

    // the following imports are only needed when you're recording
    // audio-only using the videojs-wavesurfer plugin
    /*
    import WaveSurfer from 'wavesurfer.js';
    import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';
    WaveSurfer.microphone = MicrophonePlugin;

    // register videojs-wavesurfer plugin
    import videojs_wavesurfer_css from 'videojs-wavesurfer/dist/css/videojs.wavesurfer.css';
    import Wavesurfer from 'videojs-wavesurfer/dist/videojs.wavesurfer.js';
    */

    import Record from 'videojs-record/dist/videojs.record.js'

    export default {
        data() {
            return {
                player: '',
                options: {
                    controls: true,
                    autoplay: false,
                    fluid: false,
                    loop: false,
                    width: 320,
                    height: 240,
                    bigPlayButton: false,
                    controlBar: {
                        volumePanel: false
                    },
                    plugins: {
                        /*
                        // this section is only needed when recording audio-only
                        wavesurfer: {
                            backend: 'WebAudio',
                            waveColor: '#36393b',
                            progressColor: 'black',
                            debug: true,
                            cursorWidth: 1,
                            displayMilliseconds: true,
                            hideScrollbar: true,
                            plugins: [
                                // enable microphone plugin
                                WaveSurfer.microphone.create({
                                    bufferSize: 4096,
                                    numberOfInputChannels: 1,
                                    numberOfOutputChannels: 1,
                                    constraints: {
                                        video: false,
                                        audio: true
                                    }
                                })
                            ]
                        },
                        */
                        // configure videojs-record plugin
                        record: {
                            audio: false,
                            video: true,
                            debug: true
                        }
                    }
                }
            };
        },
        mounted() {
            /* eslint-disable no-console */
            this.player = videojs('#myVideo', this.options, () => {
                // print version information at startup
                var msg = 'Using video.js ' + videojs.VERSION +
                    ' with videojs-record ' + videojs.getPluginVersion('record') +
                    ' and recordrtc ' + RecordRTC.version;
                videojs.log(msg);
            });

            // device is ready
            this.player.on('deviceReady', () => {
                console.log('device is ready!');
            });

            // user clicked the record button and started recording
            this.player.on('startRecord', () => {
                console.log('started recording!');
            });

            // user completed recording and stream is available
            this.player.on('finishRecord', () => {
                // the blob object contains the recorded data that
                // can be downloaded by the user, stored on server etc.
                console.log('finished recording: ', this.player.recordedData);
            });

            // error handling
            this.player.on('error', (element, error) => {
                console.warn(error);
            });

            this.player.on('deviceError', () => {
                console.error('device error:', this.player.deviceErrorCode);
            });
        },
        beforeDestroy() { 
            if (this.player) {
                this.player.dispose();
            }
        }
    }
</script>
```

Replace the content of `src/App.vue` with:

```html
<template>
  <div id="app">
    <VideoJSRecord />
  </div>
</template>

<script>
import VideoJSRecord from './components/VideoJSRecord.vue'

export default {
  name: 'app',
  components: {
    VideoJSRecord
  }
}
</script>

<style>
/* change player background color */
#myVideo {
  background-color: #95DDF5;
}
</style>
```

## Run

Start the Vue.js development server:

```console
npm run serve
```

And open http://localhost:8080 in a browser.
