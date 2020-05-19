# UmiJS

This page shows how to get started with [UmiJS](https://umijs.org) and videojs-record.

## Installation

Create a project directory, e.g. `umi-videojs-record`.

Create project files and install dependencies in the project directory:

```console
npm create @umijs/umi-app
npm install
```

Install videojs-record:

```console
npm install --save videojs-record
```

## Configuration

Change `.umirc.ts`:

```ts
import { defineConfig } from 'umi';

export default defineConfig({
  chainWebpack(config) {
      // Set alias for videojs-record
      config.resolve.alias.set('videojs', 'video.js');
      config.resolve.alias.set('WaveSurfer', 'wavesurfer.js');
      config.resolve.alias.set('RecordRTC', 'recordrtc');
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
});
```

## Application

Edit `src/pages/index.js`:

```javascript
/* eslint-disable */
import React, { Component } from 'react';

import './app.css';

import 'video.js/dist/video-js.css';
import videojs from 'video.js';

import 'webrtc-adapter';
import RecordRTC from 'recordrtc';

// register videojs-record plugin with this import
import 'videojs-record/dist/css/videojs.record.css';
import Record from 'videojs-record/dist/videojs.record.js';

const videoJsOptions = {
    controls: true,
    bigPlayButton: false,
    width: 320,
    height: 240,
    fluid: false,
    plugins: {
        /*
        // wavesurfer section is only needed when recording audio-only
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
        record: {
            audio: true,
            video: true,
            maxLength: 10,
            debug: true
        }
    }
};

class VideojsRecordComponent extends Component {
  componentDidMount() {
      // instantiate Video.js
      this.player = videojs(this.videoNode, this.props, () => {
      // print version information at startup
      const version_info =
        'Using video.js ' +
        videojs.VERSION +
        ' with videojs-record ' +
        videojs.getPluginVersion('record') +
        ' and recordrtc ' +
        RecordRTC.version;
      videojs.log(version_info);
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
      // recordedData is a blob object containing the recorded data that
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
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }
  render() {
    return (
      <div data-vjs-player>
        <video
          id="myVideo"
          ref={node => (this.videoNode = node)}
          className="video-js vjs-default-skin"
          playsInline
        ></video>
      </div>
    );
  }
}

const RecordComponent = () => <VideojsRecordComponent {...videoJsOptions}/>

export default RecordComponent;
```

Create `src/pages/app.css`:

```css
/* change player background color */
#myVideo {
  background-color: #95DDF5;
}
```

## Run

Start the development server:

```console
npm start
```

And open http://localhost:8000 in a browser.
