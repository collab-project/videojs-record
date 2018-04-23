/**
 * @since 2.2.0
 */

import document from 'global/document';

import Player from 'video.js';


const TestHelpers = {
    TEST_OGG: '/base/test/support/audio.ogg',

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
                wavesurfer: {
                    src: "live",
                    waveColor: "#36393b",
                    progressColor: "#black",
                    debug: true,
                    cursorWidth: 1,
                    msDisplayMax: 20,
                    hideScrollbar: true
                },
                record: {
                    audio: true,
                    video: false,
                    maxLength: 20,
                    debug: true
                }
            }
        };

        return videojs(elementTag.id, playerOptions);
    },

    makeVideoOnlyPlayer() {
        var tag = TestHelpers.makeTag('video', 'videoOnly');
        return this.makePlayer(tag, {
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
                    maxLength: 20,
                    debug: true
                }
            }
        });
    },

    makeImageOnlyPlayer() {
        var tag = TestHelpers.makeTag('video', 'imageOnly');
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