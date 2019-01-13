/**
 * React example.
 */

class VideojsRecordPlayer extends React.Component {
    componentDidMount() {
        // instantiate Video.js
        this.player = videojs(this.videoNode, this.props, () => {
            // print version information at startup
            var msg = 'Using video.js ' + videojs.VERSION +
                ' with videojs-record ' + videojs.getPluginVersion('record') +
                ' and recordrtc ' + RecordRTC.version;
            videojs.log(msg);
        });

        // error handling
        this.player.on('error', (error) => {
            console.warn(error);
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
    }

    // destroy player on unmount
    componentWillUnmount() {
        if (this.player) {
            this.player.dispose();
        }
    }

    // wrap the player in a div with a `data-vjs-player` attribute
    // so videojs won't create additional wrapper in the DOM
    // see https://github.com/videojs/video.js/pull/3856
    render() {
        return (
            <div data-vjs-player>
                <video id="myVideo" ref={ node => this.videoNode = node } className="video-js vjs-default-skin"></video>
            </div>
        )
    }
}

const videoJsOptions = {
    controls: true,
    width: 320,
    height: 240,
    fluid: false,
    plugins: {
        record: {
            audio: true,
            video: true,
            maxLength: 10,
            debug: true
        }
    }
};

// use correct video mimetype for opera
if (!!window.opera || navigator.userAgent.indexOf('OPR/') !== -1) {
    videoJsOptions.plugins.record.videoMimeType = 'video/webm\;codecs=vp8'; // or vp9
}

ReactDOM.render(<VideojsRecordPlayer { ...videoJsOptions } />, document.getElementById('root'));
