/*! videojs-record
 * Copyright (c) 2014-2015 Collab
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
         * @param {videojs.Player|Object} player
         * @param {Object} options Player options.
         * @param {Function} ready Ready callback function.
         */
        init: function(player, options, ready)
        {
            // run base component initializing with new options.
            videojs.Component.call(this, player, options, ready);

            // parse settings
            this.recordAudio = this.options().options.audio;
            this.recordVideo = this.options().options.video;
            this.recordTimeMax = this.options().options.recordTimeMax;

            this._recording = false;

            if (this.recordAudio)
            {
                // XXX: enable videojs-wavesurfer plugin automatically
                this.surfer = player.waveform;

                // display max record time
                this.surfer.setDuration(this.recordTimeMax);
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
            if (this.recordAudio)
            {
                // setup microphone
                this.surfer.microphone.on('deviceReady', this.onDeviceReady.bind(this));
                this.surfer.microphone.on('deviceError', this.onDeviceError.bind(this));

                // open browser device selection dialog
                this.player().play();
            }
        },

        /**
         * Invoked when the device is ready.
         */
        onDeviceReady: function()
        {
            // hide device button
            this.player().deviceButton.hide();

            // show record button
            this.player().recordToggle.show();

            // setup recording
            if (this.recordAudio && !this.recordVideo)
            {
                // audio-only
                this.engine = RecordRTC(this.surfer.microphone.stream);
            }
            else if (this.recordAudio && this.recordVideo)
            {
                // XXX: audio and video
            }
            else if (!this.recordAudio && this.recordVideo)
            {
                // XXX: video-only
            }
        },

        /**
         * Invoked when an device error occurred.
         */
        onDeviceError: function(code)
        {
            console.warn('onDeviceError', code);

            // XXX: display error
        },

        /**
         * Start recording.
         */
        start: function()
        {
            this._recording = true;

            // hide play control
            this.player().controlBar.playToggle.hide();

            // disable playback events
            this.surfer.setupPlaybackEvents(false);

            // start/resume live visualization
            this.surfer.liveMode = true;
            this.player().play();

            // start countdown
            this.startTime = this.surfer.microphone.stream.currentTime;
            this.countDown = this.setInterval(this.onCountDown.bind(this), 100);

            // start recording stream
            this.engine.startRecording();

            // notify UI
            this.trigger('startRecord');
        },

        /**
         * Stop recording.
         */
        stop: function()
        {
            this._recording = false;

            // stop countdown
            this.clearInterval(this.countDown);

            // stop recording stream
            this.engine.stopRecording(this.onStopRecording.bind(this));

            // notify UI
            this.trigger('stopRecord');
        },

        /**
         * Invoked when recording is stopped and resulting stream is available.
         * @param {string} audioURL Reference to the recorded Blob object, eg.
         *   blob:http://localhost:8080/10100016-4248-9949-b0d6-0bb40db56eba
         */
        onStopRecording: function(audioURL)
        {
            // get stream data
            var recordedBlob = this.engine.getBlob();

            if (this.recordAudio)
            {
                // Pausing the player so we can visualize the recorded data
                // will trigger an async videojs 'pause' event that we have
                // to wait for.
                this.player().one('pause', function()
                {
                    // show play control
                    // XXX: once the waveform's ready?
                    this.player().controlBar.playToggle.show();

                    // setup events during playback
                    this.surfer.setupPlaybackEvents(true);

                    // display loader
                    this.player().loadingSpinner.show();

                    // visualize recorded stream
                    this.surfer.load(recordedBlob);

                }.bind(this));

                // pause player's live visualization
                this.player().pause();
            }
        },

        /**
         * Invoked during recording and displays the remaining time.
         */
        onCountDown: function()
        {
            var currentTime = this.surfer.microphone.stream.currentTime - this.startTime;
            var duration = this.recordTimeMax;

            // update duration
            this.surfer.setDuration(duration);

            if (currentTime >= duration)
            {
                // stop countdown
                this.stop();

                currentTime = duration;
            }

            // update current time
            this.surfer.setCurrentTime(currentTime, duration);
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

            this.on('click', this.onClick);
            this.on(player, 'startRecord', this.onStart);
            this.on(player, 'stopRecord', this.onStop);
        }
    });

    RecordToggle.prototype.onClick = function(e)
    {
        // stop this event before it bubbles up
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
        // stop this event before it bubbles up
        e.stopImmediatePropagation();

        // open device dialog
        this.player().recorder.getDevice();
    };

    // Note that we're not doing this in prototype.createEl() because
    // it won't be called by Component.init (due to name obfuscation).
    /**
     * Create a custom button
     * @param className {string} class name for the new button
     * @param label {string} label for the new button
     */
    var createButton = function(className, label)
    {
        var props = {
            className: 'vjs-' + className + '-button vjs-control',
            innerHTML: '<div class="vjs-control-content"><span class="vjs-control-text">' +
                label + '</span></div>',
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

    // plugin defaults
    var defaults = {
        audio: false,
        video: true,
        recordTimeMax: 10
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
            'el': createButton('device', player.localize('Device')),
        });
        player.recorder.el().appendChild(player.deviceButton.el());

        // add record toggle
        player.recordToggle = new RecordToggle(player,
        {
            'el': createButton('record', player.localize('Record')),
        });
        player.recordToggle.hide();
        player.controlBar.el().insertBefore(player.recordToggle.el(),
            player.controlBar.el().firstChild);
    };

    // register the plugin
    videojs.plugin('record', record);

})(window, window.videojs);
