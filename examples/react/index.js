/**
 * React example.
 */

class VideojsRecordPlayer extends React.Component {
    componentDidMount() {
        // instantiate Video.js
        this.player = videojs(this.videoNode, this.props, function onPlayerReady(){
            // print version information at startup
            videojs.log('Using video.js', videojs.VERSION,
                'with videojs-record', videojs.getPluginVersion('record'));
        });

        // error handling
        this.player.on('error', function(error) {
            console.warn(error);
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
                <video id="myVideo" ref={ node => this.videoNode = node } className="video-js"></video>
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

ReactDOM.render(<VideojsRecordPlayer { ...videoJsOptions } />, document.getElementById('root'));
