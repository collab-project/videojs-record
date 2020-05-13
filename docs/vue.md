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
vue create --default videojs-record-vue
```

Install videojs-record:

```console
cd videojs-record-vue
npm install --save videojs-record
```

## Configuration

Create `vue.config.js` with the following content:

```javascript
const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    resolve: {
        alias: {
            videojs: 'video.js',
            WaveSurfer: 'wavesurfer.js',
            RecordRTC: 'recordrtc'
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            videojs: 'video.js/dist/video.cjs.js',
            RecordRTC: 'recordrtc'
        })
    ]
  }
}
```

## Application

Create `src/components/VideoJSRecord.vue`:

```html
<template>
    <video id="myVideo" class="video-js vjs-default-skin" playsinline></video>
</template>

<script>
    import 'video.js/dist/video-js.css'
    import 'videojs-record/dist/css/videojs.record.css'

    import 'webrtc-adapter'
    import RecordRTC from 'recordrtc'

    import videojs from 'video.js'
    // eslint-disable-next-line
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
                    controlBar: {
                        volumePanel: false
                    },
                    plugins: {
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

Change `src/App.vue` to:

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
