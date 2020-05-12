# React

This page shows how to get started with [React](https://reactjs.org) and videojs-record using the [create-react-app](https://github.com/facebook/create-react-app) utility.

## Installation

Create an example application called `record-app`:

```console
npx create-react-app record-app
```

Install videojs-record:

```console
cd record-app
npm install --save videojs-record
```

Install [react-app-wired](https://github.com/timarney/react-app-rewired) that we'll use to configure Webpack:

```console
npm install react-app-rewired --save-dev
```

## Application

Edit `src/index.js`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

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

ReactDOM.render(<App { ...videoJsOptions }/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
```

Edit `src/App.js`:

```javascript
/* eslint-disable */
import React, { Component } from 'react';

import './App.css';

import 'video.js/dist/video-js.css';
import videojs from 'video.js';

import 'webrtc-adapter';
import RecordRTC from 'recordrtc';

/*
// Required imports when recording audio-only using the videojs-wavesurfer plugin
import WaveSurfer from 'wavesurfer.js';
import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';
WaveSurfer.microphone = MicrophonePlugin;

// Register videojs-wavesurfer plugin
import 'videojs-wavesurfer/dist/css/videojs.wavesurfer.css';
import Wavesurfer from 'videojs-wavesurfer/dist/videojs.wavesurfer.js';
*/

// register videojs-record plugin with this import
import 'videojs-record/dist/css/videojs.record.css';
import Record from 'videojs-record/dist/videojs.record.js';

// Optional imports for videojs-record plugins
/*
// webm-wasm plugin (npm install webm-wasm @mattiasbuelens/web-streams-polyfill)
// Make sure to copy webm-worker.js and webm-wasm.wasm from
// node_modules/webm-wasm/dist/ to the project's public directory
import '@mattiasbuelens/web-streams-polyfill/dist/polyfill.min.js';
import 'videojs-record/dist/plugins/videojs.record.webm-wasm.js';

// ts-ebml plugin (npm install ts-ebml)
import 'videojs-record/dist/plugins/videojs.record.ts-ebml.js';
*/

class App extends Component {
    componentDidMount() {
        // instantiate Video.js
        this.player = videojs(this.videoNode, this.props, () => {
            // print version information at startup
            var version_info = 'Using video.js ' + videojs.VERSION +
                ' with videojs-record ' + videojs.getPluginVersion('record') +
                ' and recordrtc ' + RecordRTC.version;
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
            <video id="myVideo" ref={node => this.videoNode = node} className="video-js vjs-default-skin" playsInline></video>
        </div>
        );
    }
}

export default App;
```

Add the following to `src/index.css`:

```css
/* change player background color */
#myVideo {
  background-color: #ACB2F2;
}
```

## Webpack configuration

Create a `config-overrides.js` file in the root directory:

```javascript
const webpack = require("webpack");

module.exports = function override(config, env) {
  // Extend the config to work with the videojs-record project without ejecting create react app.
  // Reference: https://github.com/collab-project/videojs-record/wiki/React
  // Instead of ejecting apply webpack config changes here.
  const videojsPlugin = new webpack.ProvidePlugin({
    videojs: "video.js/dist/video.cjs.js",
    RecordRTC: "recordrtc"
  });
  const videojsAlias = {
    videojs: "video.js",
    WaveSurfer: "wavesurfer.js",
    RecordRTC: "recordrtc"
  };
  config.resolve.alias = { ...config.resolve.alias, ...videojsAlias };
  config.plugins.push(videojsPlugin);
  return config;
};
```

Change the existing calls to `react-scripts` in the `scripts` section of `package.json` for the `start`, `build` and `test` commands:

```diff
  "scripts": {
-   "start": "react-scripts start",
+   "start": "react-app-rewired start",
-   "build": "react-scripts build",
+   "build": "react-app-rewired build",
-   "test": "react-scripts test --env=jsdom",
+   "test": "react-app-rewired test --env=jsdom",
    "eject": "react-scripts eject"
}
```

## Run

Now run `npm start` and visit http://localhost:3000 to try the example application.
