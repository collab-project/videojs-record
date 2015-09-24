/// <reference path="emscripten.d.ts" />
/// <reference path="libvorbis.asmjs.d.ts" />
/// <reference path="../typings/es6-promise/es6-promise.d.ts" />
var libvorbis;
(function (libvorbis) {
    function makeRawNativeModule(options) {
        return new Promise(function (resolve, reject) {
            libvorbis._makeRawNativeModule(options, resolve);
        });
    }
    libvorbis.makeRawNativeModule = makeRawNativeModule;
})(libvorbis || (libvorbis = {}));
/// <reference path="emscripten.d.ts" />
var libvorbis;
(function (libvorbis) {
    var OggVbrModule;
    (function (OggVbrModule) {
        function fromRawNativeModule(module) {
            return {
                rawModule: module,
                create: module.cwrap('encoder_create_vbr', 'number', ['number', 'number', 'number']),
                writeHeaders: module.cwrap('encoder_write_headers', null, ['number']),
                prepareAnalysisBuffers: module.cwrap('encoder_prepare_analysis_buffers', null, ['number', 'number']),
                getAnalysisBuffer: module.cwrap('encoder_get_analysis_buffer', 'number', ['number', 'number']),
                encode: module.cwrap('encoder_encode', null, ['number']),
                getData: module.cwrap('encoder_get_data', 'number', ['number']),
                getDataLength: module.cwrap('encoder_get_data_len', 'number', ['number']),
                clearData: module.cwrap('encoder_clear_data', null, ['number']),
                finish: module.cwrap('encoder_finish', null, ['number']),
                destroy: module.cwrap('encoder_destroy', null, ['number'])
            };
        }
        OggVbrModule.fromRawNativeModule = fromRawNativeModule;
    })(OggVbrModule = libvorbis.OggVbrModule || (libvorbis.OggVbrModule = {}));
})(libvorbis || (libvorbis = {}));
/// <reference path="emscripten.d.ts" />
/// <reference path="NativeModule.ts" />
/// <reference path="OggVbrModule.ts" />
/// <reference path="OggVbrEncoderOptions.d.ts" />
var libvorbis;
(function (libvorbis) {
    var OggVbrEncoder = (function () {
        function OggVbrEncoder(module, options) {
            this.module = module;
            this.handle = this.module.create(options.channels, options.sampleRate, options.quality);
            this.module.writeHeaders(this.handle);
        }
        OggVbrEncoder.create = function (options) {
            return libvorbis.makeRawNativeModule()
                .then(libvorbis.OggVbrModule.fromRawNativeModule)
                .then(function (module) { return new OggVbrEncoder(module, options); });
        };
        /**
         * Performs a encoding step on the provided PCM channel data.
         * It may or may not produce an output ArrayBuffer.
         *
         * @param channelData An array of PCM data buffers (one for each channel).
         */
        OggVbrEncoder.prototype.encode = function (channelData) {
            var samples = channelData[0].length;
            this.module.prepareAnalysisBuffers(this.handle, samples);
            for (var ch = 0; ch < channelData.length; ++ch) {
                var data = channelData[ch];
                var bufferPtr = this.module.getAnalysisBuffer(this.handle, ch);
                this.module.rawModule.HEAPF32.set(data, bufferPtr >> 2);
            }
            this.module.encode(this.handle);
            return this.flush();
        };
        /**
         * Finalizes the OGG Vorbis stream.
         * It may or may not produce an output ArrayBuffer.
         */
        OggVbrEncoder.prototype.finish = function () {
            this.module.finish(this.handle);
            var buffer = this.flush();
            this.module.destroy(this.handle);
            this.module = null;
            return buffer;
        };
        OggVbrEncoder.prototype.flush = function () {
            var dataLength = this.module.getDataLength(this.handle);
            if (dataLength === 0)
                return null;
            var dataPointer = this.module.getData(this.handle);
            var chunk = this.module.rawModule.HEAPU8.subarray(dataPointer, dataPointer + dataLength);
            var data = new Uint8Array(chunk); // copy
            var buffer = data.buffer;
            this.module.clearData(this.handle);
            return buffer;
        };
        return OggVbrEncoder;
    })();
    libvorbis.OggVbrEncoder = OggVbrEncoder;
})(libvorbis || (libvorbis = {}));
