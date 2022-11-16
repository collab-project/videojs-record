# React

This guide shows you how to get started with [React](https://reactjs.org) and
videojs-record using [create-react-app](https://github.com/facebook/create-react-app).

For more information, check the video.js [documentation](https://videojs.com/guides/react/)
for React.

## Installation

Create an example React application called `videojs-record-react`:

```console
npx create-react-app videojs-record-react
```

Install videojs-record:

```console
cd videojs-record-react
npm install --save videojs-record
```

## Application

Replace content of `src/App.js` with:

```javascript
import './App.css';
import React from 'react';

import VideoJSComponent from './VideoJSComponent';

function App() {
  const playerRef = React.useRef(null);
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
        msDisplayMax: 20,
        hideScrollbar: true,
        displayMilliseconds: true,
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

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // handle player events
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
      // recordedData is a blob object containing the recorded data that
      // can be downloaded by the user, stored on server etc.
      console.log('finished recording: ', player.recordedData);
    });

    // error handling
    player.on('error', (element, error) => {
      console.warn(error);
    });

    player.on('deviceError', () => {
      console.error('device error:', player.deviceErrorCode);
    });
  };

  return (
    <div className="App">
      <VideoJSComponent options={videoJsOptions} onReady={handlePlayerReady} />
    </div>
  );
}

export default App;
```

Add the following to `src/App.css`:

```css
/* change player background color */
.App video-js {
  background-color: #ACB2F2;
}
```

Create `src/VideoJSComponent.js`:

```javascript
import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

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

export const VideoJSComponent = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const {options, onReady} = props;

  React.useEffect(() => {

    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement('video-js');

      videoElement.className = 'video-js vjs-default-skin';
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, () => {
        // print version information at startup
        const version_info = 'Using video.js ' + videojs.VERSION +
          ' with videojs-record ' + videojs.getPluginVersion('record') +
          ', recordrtc ' + RecordRTC.version + ' and React ' + React.version;
        videojs.log(version_info);

        onReady && onReady(player);
      });

    // You could update an existing player in the `else` block here
    // on prop change
    } else {
      // const player = playerRef.current;
      // player.record().getDevice();
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJSComponent;
```

## Run

Start the development server:

```console
npm start
```

And open http://localhost:3000 in a browser.
