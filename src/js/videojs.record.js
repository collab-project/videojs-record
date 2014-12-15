/*! videojs-record
 * Copyright (c) 2014 Collab
 * Licensed under the MIT license. */
(function(window, videojs) {
    'use strict';

    /**
     * Record audio/video with the video.js player.
     */
    videojs.Recorder = videojs.Component.extend({

        /**
         * The constructor function for the class.
         * 
         * @param options: Player options.
         * @param ready: Ready callback function.
         */
        init: function(player, options, ready)
        {
            // run base component initializing with new options.
            videojs.Component.call(this, player, options, ready);

            console.log('videojs.Recorder', this.options().options);

            this._recording = false;

            // get browser-specific getUserMedia
            /*this.getUserMedia = (
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia
            ).bind(navigator);*/

            // add device button
            //this.device_btn = new DeviceButton(player);
            //player.addChild(this.device_btn); //this.device_btn);

            // add record button
            //this.record_btn = new videojs.RecordToggle(player);
            //this.record_btn.hide();
            //player.controlBar.addChild(this.record_btn);
        },

        /**
         * Indicates whether we're currently recording or not.
         */
        isRecording: function()
        {
            return this._recording;
        },

        /**
         * Open the brower's recording device selection dialog.
         */
        getDevice: function()
        {
            console.log('getDevice');
            this.startPlayers();

            // init Microphone plugin
            /*this.microphone = Object.create(WaveSurfer.Microphone);
            console.log(this.player());
            this.microphone.init({
                wavesurfer: this.player().waveform.surfer
            });

            this.microphone.start();*/
            /*this.getUserMedia({
                video: false,
                audio: true
            },
            this.microphone.gotStream.bind(this),
            this.microphone.streamError.bind(this));*/
        },

        /**
         * Start recording.
         */
        start: function()
        {
            console.log('start recording');

            this._recording = true;

            this.trigger('startRecord');
        },

        /**
         * Stop recording.
         */
        stop: function()
        {
            console.log('stop recording');

            this._recording = false;

            this.trigger('stopRecord');
        },

        /**
         * Start the players.
         */
        startPlayers: function()
        {
            var options = this.options().options;
            console.log('startplayers', this.player().waveform.surfer);
            // init waveform
            this.initialize(options);

            // start loading
            if (options.src !== undefined)
            {
                this.load(options.src);
            }
        },

        /**
         * Initializes the waveform.
         * 
         * @param opts: Plugin options.
         */
        initialize: function(opts)
        {
            this.originalHeight = this.player().options().height;

            // set waveform element and dimensions
            opts.container = this.el();
            opts.height = this.player().height() - this.player().controlBar.height();

            // customize waveform appearance
            this.player().waveform.surfer.init(opts);
        }

    });

    var RecordToggle, DeviceButton;

    /**
     * Button to toggle between start and stop recording
     * @param {videojs.Player|Object} player
     * @param {Object=} options
     * @class
     * @constructor
    */
    RecordToggle = videojs.Button.extend(
    {
        /** @constructor */
        init: function(player, options)
        {
            videojs.Button.call(this, player, options);

            this.on(player, 'startRecord', this.onStart);
            this.on(player, 'stopRecord', this.onStop);
        }
    });

    RecordToggle.prototype.onClick = function(e)
    {
        var recorder = this.player().recorder;
        console.log('click record');
        if (!recorder.isRecording())
        {
            recorder.start();
        }
        else
        {
            recorder.stop();
        }
    };

    RecordToggle.prototype.onStart = function()
    {
        // add the vjs-record-start class to the element so it can change appearance
        this.removeClass('vjs-record-stop');
        this.addClass('vjs-record-start');

        // update label
        this.el_.children[0].children[0].innerHTML = this.localize('Stop');
    };

    RecordToggle.prototype.onStop = function()
    {
        // add the vjs-record-stop class to the element so it can change appearance
        this.removeClass('vjs-record-start');
        this.addClass('vjs-record-stop');

        // update label
        this.el_.children[0].children[0].innerHTML = this.localize('Record');
    };

    /**
     * Button to select recording device
     * @param {videojs.Player|Object} player
     * @param {Object=} options
     * @class
     * @constructor
    */
    DeviceButton = videojs.Button.extend({});
    DeviceButton.prototype.onClick = function()
    {
        console.log('click device button');

        // open device dialog
        this.player().recorder.getDevice();
    };

    // Note that we're not doing this in prototype.createEl() because
    // it won't be called by Component.init (due to name obfuscation).
    var createDeviceButton = function() {
        var props = {
            className: 'vjs-device-button vjs-control',
            innerHTML: '<div class="vjs-control-content"><span class="vjs-control-text">' + ('Device') + '</span></div>',
            role: 'button',
            'aria-live': 'polite', // let the screen reader user know that the text of the button may change
            tabIndex: 0
        };
        return videojs.Component.prototype.createEl(null, props);
    };

    var createPlugin = function()
    {
        var props = {
            className: 'vjs-record',
            tabIndex: 0
        };
        return videojs.Component.prototype.createEl(null, props);
    };

    var defaults = {
        audio: false,
        video: true
    };

    /**
     * Initialize the plugin.
     * @param options (optional) {object} configuration for the plugin
     */
    var record = function(options)
    {
        var settings = videojs.util.mergeOptions(defaults, options);
        var player = this;

        // create new recorder
        player.recorder = new videojs.Recorder(player,
        {
            'el': createPlugin(),
            'options': settings
        });
        player.el().appendChild(player.recorder.el());

        // create new device button
        player.deviceButton = new DeviceButton(player,
        {
            'el' : createDeviceButton(),
        });
        player.recorder.el().appendChild(player.deviceButton.el());
    };

    // register the plugin
    videojs.plugin('record', record);

})(window, window.videojs);
