/// <reference path="OggVbrEncoderOptions.d.ts" />
/// <reference path="OggVbrAsyncEncoderMessages.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts" />
var libvorbis;
(function (libvorbis) {
    var OggVbrAsyncEncoder = (function () {
        /**
         * Call static method create() to instantiate this class!
         */
        function OggVbrAsyncEncoder(worker, onData, onFinished) {
            var _this = this;
            this.worker = worker;
            this.onData = onData;
            this.onFinished = onFinished;
            this.handleWorkerMessage = function (event) {
                var message = event.data;
                switch (message.kind) {
                    case 'data':
                        _this.onWorkerData(message);
                        break;
                    case 'finished':
                        _this.onWorkerFinished(message);
                        break;
                }
            };
            this.worker.addEventListener('message', this.handleWorkerMessage);
        }
        OggVbrAsyncEncoder.create = function (options, onData, onFinished) {
            return new Promise(function (resolve, reject) {
                var worker = new Worker(options.workerURL);
                var onWorkerMessage = function (ev) {
                    worker.removeEventListener('message', onWorkerMessage);
                    var message = ev.data;
                    switch (message.kind) {
                        case 'loaded':
                            var encoder = new OggVbrAsyncEncoder(worker, onData, onFinished);
                            resolve(encoder);
                            break;
                        default:
                            reject('unexpected message.');
                            break;
                    }
                };
                worker.addEventListener('message', onWorkerMessage);
                var command = {
                    kind: 'init',
                    moduleURL: options.moduleURL,
                    encoderOptions: options.encoderOptions
                };
                worker.postMessage(command);
            });
        };
        /**
         * Performs a encoding step on the provided PCM channel data.
         *
         * @param channelData An array of PCM data buffers (one for each channel).
         */
        OggVbrAsyncEncoder.prototype.encode = function (channelData) {
            var buffers = channelData.map(function (ch) { return ch.buffer; });
            var command = {
                kind: 'encode',
                buffers: buffers
            };
            this.worker.postMessage(command);
        };
        /**
         * Performs a encoding step on the provided PCM channel data.
         * Warning: passed buffers will be transferred to the Worker, rendering
         * them unusable from this thread.
         *
         * @param channelData An array of PCM data buffers (one for each channel).
         */
        OggVbrAsyncEncoder.prototype.encodeTransfer = function (channelData) {
            var buffers = channelData.map(function (ch) { return ch.buffer; });
            var command = {
                kind: 'encode',
                buffers: buffers
            };
            this.worker.postMessage(command, buffers);
        };
        /**
         * Finalizes the OGG Vorbis stream.
         */
        OggVbrAsyncEncoder.prototype.finish = function () {
            var command = {
                kind: 'finish'
            };
            this.worker.postMessage(command);
        };
        OggVbrAsyncEncoder.prototype.onWorkerData = function (message) {
            this.onData(message.data);
        };
        OggVbrAsyncEncoder.prototype.onWorkerFinished = function (message) {
            this.worker.terminate();
            this.worker = null;
            this.onFinished();
        };
        return OggVbrAsyncEncoder;
    })();
    libvorbis.OggVbrAsyncEncoder = OggVbrAsyncEncoder;
})(libvorbis || (libvorbis = {}));
