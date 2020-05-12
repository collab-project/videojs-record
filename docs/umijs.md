# UmiJS

This page shows how to get started with [UmiJS](https://umijs.org) and videojs-record.

## Installation

Install UmiJS globally:

```console
npm install -g umi
```

Create an example project called `umi-record` and pick the `app` type:

```console
mkdir umi-record && cd umi-record
npm create umi
```

Install videojs-record:

```console
npm install --save videojs-record
```

## Application

Edit `src/pages/index.js`:

```javascript
/* eslint-disable */
import React, { Component } from 'react';

import styles from './index.css';

import 'video.js/dist/video-js.css';
import videojs from 'video.js';

import 'webrtc-adapter';
import RecordRTC from 'recordrtc';

// register videojs-record plugin with this import
import 'videojs-record/dist/css/videojs.record.css';
import Record from 'videojs-record/dist/videojs.record.js';

const videoJsOptions = {
    controls: true,
    width: 320,
    height: 240,
    fluid: false,
    plugins: {
        /*
        // wavesurfer section is only needed when recording audio-only
        wavesurfer: {
            src: 'live',
            waveColor: '#36393b',
            progressColor: 'black',
            debug: true,
            cursorWidth: 1,
            msDisplayMax: 20,
            hideScrollbar: true
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
      var version_info =
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

## Webpack configuration

Change `.umirc.js`:

```javascript
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  chainWebpack(config) {
      // Set alias for videojs-record
      config.resolve.alias.set('videojs', 'video.js');
      config.resolve.alias.set('WaveSurfer', 'wavesurfer.js');
      config.resolve.alias.set('RecordRTC', 'recordrtc');
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: false,
      dva: false,
      dynamicImport: false,
      title: 'umi-record',
      dll: false,
      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
  ],
}
```

## Run

Now run `npm start` and visit http://localhost:8000 to try the example application.
