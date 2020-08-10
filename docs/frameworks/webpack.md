# Webpack

This document describes how to setup [Webpack](https://webpack.js.org/) with videojs-record.

## Installation

Create a project directory, e.g. `videojs-record-webpack`.

Create a sample `package.json`:

```console
cd videojs-record-webpack
npm init --force
```

Install Webpack:

```console
npm install -D webpack webpack-dev-server webpack-cli css-loader style-loader
```

Install videojs-record:

```console
npm install --save videojs-record
```

## Configuration

Create the Webpack configuration file called `webpack.config.js`:

```javascript
const path = require('path');
const basePath = path.resolve(__dirname);

module.exports = {
    context: path.join(basePath, 'src'),
    entry: {
        app: './app.js'
    },
    output: {
        path: path.join(basePath, 'dist'),
        filename: '[name].bundle.js',
        publicPath: '/dist'
    },
    devServer: {
        contentBase: basePath,
        watchContentBase: true
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
        }]
    }
};
```

## Application

Create `src/index.html` containing:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
      <meta charset="utf-8">
      <title>Webpack videojs-record example</title>

      <script src="/dist/app.bundle.js" type="text/javascript"></script>

      <style>
      /* change player background color */
      #myVideo {
          background-color: #1a535c;
      }
      </style>
  </head>

  <body>
    <video id="myVideo" class="video-js vjs-default-skin" playsinline></video>
  </body>

</html>
```

And create `src/app.js`:

```javascript
/* eslint-disable */
import 'video.js/dist/video-js.min.css';
import videojs from 'video.js';

import 'webrtc-adapter';
import RecordRTC from 'recordrtc';

/*
// the following imports are only needed when you're recording
// audio-only using the videojs-wavesurfer plugin
import WaveSurfer from 'wavesurfer.js';
import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';
WaveSurfer.microphone = MicrophonePlugin;

// register videojs-wavesurfer plugin
import 'videojs-wavesurfer/dist/css/videojs.wavesurfer.css';
import Wavesurfer from 'videojs-wavesurfer/dist/videojs.wavesurfer.js';
*/

// register videojs-record plugin
import 'videojs-record/dist/css/videojs.record.css';
import Record from 'videojs-record/dist/videojs.record.js';

let player;
const options = {
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
            waveColor: '#3cc8de',
            progressColor: '#203336',
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
            maxLength: 10,
            debug: true
        }
    }
};

// wait till DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // create player
    player = videojs('myVideo', options, () => {
        // print version information at startup
        const msg = 'Using video.js ' + videojs.VERSION +
            ' with videojs-record ' + videojs.getPluginVersion('record') +
            ' and recordrtc ' + RecordRTC.version;
        videojs.log(msg);
    });

    // device is ready
    player.on('deviceReady', () => {
        console.log('device is ready!');
    });

    // user clicked the record button and started recording
    player.on('startRecord', () => {
        console.log('started recording!');
    });

    // user completed recording and stream is available
    player.on('finishRecord', () => {
        // the blob object contains the recorded data that
        // can be downloaded by the user, stored on server etc.
        console.log('finished recording: ', player.recordedData);
    });

    // error handler
    player.on('error', (element, error) => {
        console.error(error);
    });

    player.on('deviceError', () => {
        console.error(player.deviceErrorCode);
    });
});
```

## Run

Start the Webpack development server:

```console
./node_modules/.bin/webpack-dev-server --mode=development
```

And open http://localhost:8080/src/index.html in a browser.
