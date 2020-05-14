# Angular

This document describes how to setup [Angular](https://angular.io) with videojs-record.

For more information, check the video.js [documentation](https://github.com/videojs/video.js/blob/master/docs/guides/angular.md)
for Angular.

## Installation

Create a project directory, e.g. `angular-videojs-record`.

Create a `package.json` file inside that project directory that lists the project
dependencies:

```json
{
    "name": "angular-videojs-record",
    "version": "1.0.0",
    "scripts": {
        "start": "webpack-dev-server --mode development"
    },
    "dependencies": {
        "@angular/common": "^9.1.6",
        "@angular/compiler": "^9.1.6",
        "@angular/core": "^9.1.6",
        "@angular/forms": "^9.1.6",
        "@angular/platform-browser": "^9.1.6",
        "@angular/platform-browser-dynamic": "^9.1.6",
        "@angular/router": "^9.1.6",
        "core-js": "^3.6.5",
        "rxjs": "^6.5.5",
        "zone.js": "^0.10.3"
    },
    "devDependencies": {
        "@types/node": "^13.13.5",
        "html-webpack-plugin": "^4.3.0",
        "raw-loader": "^4.0.1",
        "ts-loader": "^7.0.4",
        "typescript": "^3.8.3",
        "webpack": "^4.43.0",
        "webpack-cli": "^3.3.11",
        "webpack-dev-server": "^3.11.0"
    }
}
```

Install the dependencies:

```console
npm install
```

Install `videojs-record` and `@types/video.js`:

```console
npm install --save videojs-record @types/video.js
```

## Configuration

Create `tsconfig.json`:

```json
{
    "compilerOptions": {
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "target": "ES5"
    }
}
```

Create a Webpack config file called `webpack.config.js`:

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');

module.exports = {
    entry: './src/main.ts',
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            videojs: 'video.js',
            WaveSurfer: 'wavesurfer.js',
            RecordRTC: 'recordrtc'
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader']
            },
            {
                test: /\.(html|css)$/,
                use: 'raw-loader'
            }
        ]
    },
    plugins: [
        new ProvidePlugin({
            videojs: 'video.js/dist/video.cjs.js',
            RecordRTC: 'recordrtc'
        }),
        new HtmlWebpackPlugin({ template: './src/index.html' })
    ]
}
```

## Application


Create the `src/app/` directories and add a new Angular component for videojs-record
in `src/app/videojs.record.component.ts`:

```ts
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef
} from '@angular/core';

import videojs from 'video.js';
import * as adapter from 'webrtc-adapter/out/adapter_no_global.js';
import * as RecordRTC from 'recordrtc';

/*
// Required imports when recording audio-only using the videojs-wavesurfer plugin
import * as WaveSurfer from 'wavesurfer.js';
import * as MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.js';
WaveSurfer.microphone = MicrophonePlugin;

// Register videojs-wavesurfer plugin
import * as Wavesurfer from 'videojs-wavesurfer/dist/videojs.wavesurfer.js';
*/

// register videojs-record plugin with this import
import * as Record from 'videojs-record/dist/videojs.record.js';

@Component({
  selector: 'videojs-record',
  template: `
    <style>
    /* change player background color */
    .video-js video {
         background-color: #42f489;
    }
    </style>
    <video id="video_{{idx}}" class="video-js vjs-default-skin" playsinline></video>
    `
})

export class VideoJSRecordComponent implements OnInit, OnDestroy {

  // reference to the element itself: used to access events and methods
  private _elementRef: ElementRef

  // index to create unique ID for component
  idx = 'clip1';

  private config: any;
  private player: any; 
  private plugin: any;

  // constructor initializes our declared vars
  constructor(elementRef: ElementRef) {
    this.player = false;

    // save reference to plugin (so it initializes)
    this.plugin = Record;

    // video.js configuration
    this.config = {
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
        // configure videojs-record plugin
        record: {
          audio: false,
          video: true,
          debug: true
        }
      }
    };
  }

  ngOnInit() {}

  // use ngAfterViewInit to make sure we initialize the videojs element
  // after the component template itself has been rendered
  ngAfterViewInit() {
    // ID with which to access the template's video element
    let el = 'video_' + this.idx;

    // setup the player via the unique element ID
    this.player = videojs(document.getElementById(el), this.config, () => {
      console.log('player ready! id:', el);

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

  // use ngOnDestroy to detach event handlers and remove the player
  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
      this.player = false;
    }
  }

}
```

Create the Angular app module in `src/app/app.module.ts`:

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { VideoJSRecordComponent } from './videojs.record.component';

@NgModule({
    imports: [BrowserModule],
    declarations: [VideoJSRecordComponent],
    bootstrap: [VideoJSRecordComponent]
})
export class AppModule { }
```

Create an Angular polyfills file in `src/polyfills.ts`:

```ts
import 'core-js/features/reflect';
import 'zone.js/dist/zone';
```

Create the Angular main file in `src/main.ts`:

```ts
import './polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
```

And finally, create the main index HTML file in `src/index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <base href="/" />
    <title>Angular videojs-record example</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- styles -->
    <link href="node_modules/video.js/dist/video-js.css" rel="stylesheet">
    <!-- videojs.wavesurfer.css is only required when recording audio-only
    <link href="node_modules/videojs-wavesurfer/dist/css/videojs.wavesurfer.css" rel="stylesheet">
    -->
    <link href="node_modules/videojs-record/dist/css/videojs.record.css" rel="stylesheet">
</head>
<body>
    <videojs-record></videojs-record>
</body>
</html>
```

## Run

Start the development server:

```console
npm start
```

And open http://localhost:8080/ in a browser.
