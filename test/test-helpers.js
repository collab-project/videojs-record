/**
 * @since 2.2.0
 */

import document from 'global/document';

import {Player, mergeOptions} from 'video.js';

import adapter from 'webrtc-adapter';

import {LIBVORBISJS, RECORDERJS, LAMEJS, OPUSRECORDER, VMSG, WEBMWASM} from '../src/js/engine/record-engine.js';
import {TSEBML} from '../src/js/engine/convert-engine.js';

const TestHelpers = {
    TEST_OGG: '/base/test/support/audio.ogg',
    TEST_WEBM: '/base/test/support/no_metadata.webm',

    DEFAULT_WAVESURFER_OPTIONS: {
        src: 'live',
        waveColor: '#36393b',
        progressColor: 'black',
        debug: true,
        cursorWidth: 1,
        msDisplayMax: 20,
        hideScrollbar: true
    },

    /**
     * Create DOM element.
     */
    makeTag(tag_type, id_name) {
        if (tag_type === undefined) {
            tag_type = 'audio';
        }
        if (id_name === undefined) {
            id_name = 'myAudio';
        }
        const tag = document.createElement(tag_type);
        tag.id = id_name;
        tag.muted = true;
        tag.className = 'video-js vjs-default-skin';
        tag.style = 'background-color: #9FD6BA;';

        return tag;
    },

    /**
     * Create a test player containing the plugin.
     *
     * @param  {Element|String} elementTag
     * @param  {Object} playerOptions
     */
    makePlayer(elementTag, playerOptions) {
        elementTag = elementTag || TestHelpers.makeTag();

        // add to dom
        document.getElementsByTagName('body')[0].appendChild(elementTag);

        // default options
        playerOptions = playerOptions || {
            controls: true,
            autoplay: false,
            fluid: false,
            loop: false,
            width: 600,
            height: 300,
            plugins: {
                wavesurfer: this.DEFAULT_WAVESURFER_OPTIONS,
                record: {
                    audio: true,
                    video: false,
                    maxLength: 20,
                    pip: false,
                    debug: true
                }
            }
        };

        return videojs(elementTag.id, playerOptions);
    },

    makeAudioOnlyPlayer(newOptions) {
        let opts = {
            controls: true,
            autoplay: false,
            fluid: false,
            loop: false,
            width: 500,
            height: 400,
            plugins: {
                wavesurfer: this.DEFAULT_WAVESURFER_OPTIONS,
                record: {
                    audio: true,
                    video: false,
                    maxLength: 5,
                    debug: true
                }
            }
        };
        opts = mergeOptions(opts, newOptions);
        let tag = TestHelpers.makeTag('audio', 'audioOnly');
        return this.makePlayer(tag, opts);
    },

    makeAudioOnlyPluginPlayer(pluginName) {
        let tag = TestHelpers.makeTag('audio', 'audioOnly');
        let recordPluginOptions = {
            audio: true,
            video: false,
            maxLength: 5,
            debug: true
        };
        // setup audio plugin
        switch (pluginName) {
            case LAMEJS:
                recordPluginOptions.audioEngine = LAMEJS;
                recordPluginOptions.audioSampleRate = 44100;
                recordPluginOptions.audioWorkerURL = '/base/node_modules/lamejs/worker-example/worker-realtime.js';
                recordPluginOptions.audioBitRate = 128;
                break;

            case LIBVORBISJS:
                recordPluginOptions.audioEngine = LIBVORBISJS;
                recordPluginOptions.audioSampleRate = 32000;
                break;

            case OPUSRECORDER:
                recordPluginOptions.audioEngine = OPUSRECORDER;
                recordPluginOptions.audioSampleRate = 48000;
                recordPluginOptions.audioWorkerURL = '/base/node_modules/opus-recorder/dist/encoderWorker.min.js';
                recordPluginOptions.audioChannels = 2;
                break;

            case RECORDERJS:
                recordPluginOptions.audioEngine = RECORDERJS;
                break;

            case VMSG:
                recordPluginOptions.audioEngine = VMSG;
                recordPluginOptions.audioWebAssemblyURL = '/base/node_modules/vmsg/vmsg.wasm';
                break;

            default:
                recordPluginOptions.audioEngine = pluginName;
                break;
        }
        return this.makePlayer(tag, {
            controls: true,
            autoplay: false,
            fluid: false,
            loop: false,
            width: 600,
            height: 350,
            plugins: {
                wavesurfer: this.DEFAULT_WAVESURFER_OPTIONS,
                record: recordPluginOptions
            }
        });
    },

    makeVideoOnlyPluginPlayer(engineName) {
        let tag = TestHelpers.makeTag('video', 'videoOnly');
        let recordPluginOptions = {
            audio: false,
            video: true,
            maxLength: 50,
            debug: true
        };
        // setup video engine
        switch (engineName) {
            case WEBMWASM:
                recordPluginOptions.videoEngine = WEBMWASM;
                recordPluginOptions.videoWorkerURL = '/base/node_modules/webm-wasm/dist/webm-worker.js';
                recordPluginOptions.videoWebAssemblyURL = 'webm-wasm.wasm';
                break;
        }
        return this.makePlayer(tag, {
            controls: true,
            autoplay: false,
            fluid: false,
            loop: false,
            width: 320,
            height: 240,
            plugins: {
                record: recordPluginOptions
            }
        });
    },

    makeConvertPluginPlayer(pluginName) {
        let tag = TestHelpers.makeTag('video', 'videoOnly');
        let recordPluginOptions = {
            audio: false,
            video: true,
            maxLength: 50,
            debug: true
        };
        // setup audio plugin
        switch (pluginName) {
            case TSEBML:
                recordPluginOptions.convertEngine = TSEBML;
                break;

            default:
                recordPluginOptions.convertEngine = pluginName;
                break;
        }
        return this.makePlayer(tag, {
            controls: true,
            autoplay: false,
            fluid: false,
            loop: false,
            width: 320,
            height: 240,
            plugins: {
                record: recordPluginOptions
            }
        });
    },

    makeAudioVideoPlayer(newOptions) {
        let opts = {
            controls: true,
            autoplay: false,
            fluid: false,
            loop: false,
            width: 500,
            height: 400,
            plugins: {
                record: {
                    audio: true,
                    video: true,
                    maxLength: 50,
                    debug: true
                }
            }
        };
        opts = mergeOptions(opts, newOptions);
        let tag = TestHelpers.makeTag('video', 'audioVideo');
        return this.makePlayer(tag, opts);
    },

    makeVideoOnlyPlayer(newOptions) {
        let opts = {
            controls: true,
            autoplay: false,
            fluid: false,
            loop: false,
            width: 500,
            height: 400,
            plugins: {
                record: {
                    audio: false,
                    video: true,
                    maxLength: 5,
                    debug: true
                }
            }
        };
        opts = mergeOptions(opts, newOptions);
        let tag = TestHelpers.makeTag('video', 'videoOnly');
        return this.makePlayer(tag, opts);
    },

    makeImageOnlyPlayer() {
        let tag = TestHelpers.makeTag('video', 'imageOnly');
        return this.makePlayer(tag, {
            controls: true,
            autoplay: false,
            fluid: false,
            loop: false,
            width: 500,
            height: 400,
            controlBar: {
                volumePanel: false,
                fullscreenToggle: false
            },
            plugins: {
                record: {
                    image: true,
                    debug: true
                }
            }
        });
    },

    makeScreenOnlyPlayer(newOptions) {
        // use polyfill in Firefox for now, see:
        // https://blog.mozilla.org/webrtc/getdisplaymedia-now-available-in-adapter-js/
        if (adapter.browserDetails.browser === 'firefox') {
            adapter.browserShim.shimGetDisplayMedia(window, 'screen');
        }
        let opts = {
            controls: true,
            autoplay: false,
            fluid: false,
            loop: false,
            width: 400,
            height: 225,
            plugins: {
                record: {
                    audio: false,
                    video: false,
                    screen: true,
                    maxLength: 5,
                    debug: true
                }
            }
        };
        opts = mergeOptions(opts, newOptions);
        let tag = TestHelpers.makeTag('video', 'screenOnly');
        return this.makePlayer(tag, opts);
    },

    makeAnimatedPlayer() {
        let tag = TestHelpers.makeTag('video', 'animationOnly');
        return this.makePlayer(tag, {
            controls: true,
            autoplay: false,
            fluid: false,
            loop: false,
            width: 320,
            height: 240,
            controlBar: {
                volumePanel: false,
                fullscreenToggle: false
            },
            plugins: {
                record: {
                    animation: true,
                    animationQuality: 20,
                    animationFrameRate: 200,
                    maxLength: 5,
                    debug: true
                }
            }
        });
    },

    /**
     * Dispose all players.
     */
    cleanup() {
        for (const playerId in Player.players) {
            if (Player.players[playerId] !== null) {
                Player.players[playerId].dispose();
            }
            delete Player.players[playerId];
        }
    },

    /**
     * Triggers an event on a DOM node natively.
     *
     * @param  {Element} element
     * @param  {string} eventType
     */
    triggerDomEvent(element, eventType) {
        let event;

        if (document.createEvent) {
            event = document.createEvent('HTMLEvents');
            event.initEvent(eventType, true, true);
        } else {
            event = document.createEventObject();
            event.eventType = eventType;
        }

        event.eventName = eventType;

        if (document.createEvent) {
            element.dispatchEvent(event);
        } else {
            element.fireEvent('on' + event.eventType, event);
        }
    }
};

export default TestHelpers;