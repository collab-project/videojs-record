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

            this.audio = this.options().options.audio;
            this.video = this.options().options.video;

            this._recording = false;

            if (this.audio)
            {
                // enable microphone plugin
                this.microphone = Object.create(WaveSurfer.Microphone);
            }

            // hide play control
            this.player().controlBar.playToggle.hide();
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
            this.startPlayers();

            // init Microphone plugin
            this.microphone.init({
                wavesurfer: this.player().waveform.surfer
            });

            // connect to microphone device
            this.microphone.start();
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

            this.on(player, 'click', this.onClick);
            this.on(player, 'startRecord', this.onStart);
            this.on(player, 'stopRecord', this.onStop);
        }
    });

    RecordToggle.prototype.onClick = function(e)
    {
        // We need to stop this event before it bubbles up
        e.stopImmediatePropagation();

        var recorder = this.player().recorder;

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
        this.el().firstChild.firstChild.innerHTML = this.localize('Stop');
    };

    RecordToggle.prototype.onStop = function()
    {
        // add the vjs-record-stop class to the element so it can change appearance
        this.removeClass('vjs-record-start');
        this.addClass('vjs-record-stop');

        // update label
        this.el().firstChild.firstChild.innerHTML = this.localize('Record');
    };

    /**
     * Button to select recording device
     * @param {videojs.Player|Object} player
     * @param {Object=} options
     * @class
     * @constructor
    */
    DeviceButton = videojs.Button.extend(
    {
        /** @constructor */
        init: function(player, options)
        {
            videojs.Button.call(this, player, options);

            this.on('click', this.onClick);
        }
    });
    DeviceButton.prototype.onClick = function(e)
    {
        // We need to stop this event before it bubbles up
        e.stopImmediatePropagation();

        // open device dialog
        this.player().recorder.getDevice();
    };

    // Note that we're not doing this in prototype.createEl() because
    // it won't be called by Component.init (due to name obfuscation).
    var createButton = function(name)
    {
        var props = {
            className: 'vjs-' + name.toLowerCase() + '-button vjs-control',
            innerHTML: '<div class="vjs-control-content"><span class="vjs-control-text">' +
                name + '</span></div>',
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

        // create recorder
        player.recorder = new videojs.Recorder(player,
        {
            'el': createPlugin(),
            'options': settings
        });
        player.el().appendChild(player.recorder.el());

        // add device button
        player.deviceButton = new DeviceButton(player,
        {
            'el': createButton('Device'),
        });
        player.recorder.el().appendChild(player.deviceButton.el());

        // add record toggle
        player.recordToggle = new RecordToggle(player,
        {
            'el': createButton('Record'),
        });
        player.recordToggle.hide();
        player.controlBar.el().insertBefore(player.recordToggle.el(),
            player.controlBar.el().firstChild);
    };

    // register the plugin
    videojs.plugin('record', record);

})(window, window.videojs);
