/**
 * @since 2.2.0
 */

process.traceDeprecation = true;
process.env.BABEL_ENV = 'test';

const path = require('path');
require('@babel/register');

var webpackConfig = require('./build-config/webpack.prod.main.js');
var support_dir = path.resolve(__dirname, 'test', 'support');
var fakeAudioStream = path.join(support_dir, 'Front_Center.wav');
var fakeVideoStream = path.join(support_dir, 'bus_qcif_7.5fps.y4m');

// Chrome CLI options
// http://peter.sh/experiments/chromium-command-line-switches/
var chromeFlags = [
    '--no-sandbox',
    '--no-first-run',
    '--noerrdialogs',
    '--no-default-browser-check',
    '--use-fake-device-for-media-stream',
    '--use-fake-ui-for-media-stream',
    '--use-file-for-fake-audio-capture=' + fakeAudioStream,
    '--use-file-for-fake-video-capture=' + fakeVideoStream,
    '--autoplay-policy=no-user-gesture-required',
    '--user-data-dir=.chrome',
    '--disable-translate',
    '--disable-extensions',
    '--disable-infobars',
    '--ignore-certificate-errors',
    '--allow-insecure-localhost',
    '--enable-experimental-web-platform-features'
];
var firefoxFlags = {
    'media.navigator.permission.disabled': true,
    'media.navigator.streams.fake': true
};
var ci = process.env.TRAVIS || process.env.APPVEYOR;

module.exports = function(config) {
    var configuration = {
        basePath: '',
        frameworks: ['jasmine', 'jasmine-matchers', 'host-environment', 'detectBrowsers'],
        hostname: 'localhost',
        port: 9876,
        logLevel: config.LOG_INFO,
        singleRun: true,  // enable for headless testing
        autoWatch: false,
        files: [
            // demo files
            {
                pattern: 'test/support/*',
                included: false,
                watched: false,
                served: true
            },
             // style
            'node_modules/video.js/dist/video-js.css',
            'node_modules/videojs-wavesurfer/dist/css/videojs.wavesurfer.css',
            'dist/css/videojs.record.css',

            // library dependencies
            'node_modules/video.js/dist/video.js',
            'node_modules/webrtc-adapter/out/adapter.js',
            'node_modules/recordrtc/RecordRTC.js',
            'node_modules/wavesurfer.js/dist/wavesurfer.js',
            'node_modules/wavesurfer.js/dist/plugin/wavesurfer.microphone.js',
            'node_modules/videojs-wavesurfer/dist/videojs.wavesurfer.js',

            // optional library dependencies for audio plugins
            // recorder.js
            'node_modules/recorderjs/dist/recorder.js',
            // libvorbis.js
            'node_modules/libvorbis.js/js/libvorbis.min.js',
            // lamejs
            {pattern: 'node_modules/lamejs/worker-example/*worker*.js', included: false, served: true},
            'node_modules/lamejs/lame.min.js',
            // opus-recorder
            {pattern: 'node_modules/opus-recorder/dist/*Worker.min.js', included: false, served: true},
            {pattern: 'node_modules/opus-recorder/dist/*.wasm', included: false, served: true, type: 'wasm'},
            'node_modules/opus-recorder/dist/recorder.min.js',

            // only available on CDN
            'http://cdn.webrtc-experiment.com/gif-recorder.js',

            // specs
            {pattern: 'test/**/*.spec.js', watched: false}
        ],
        // for CDN scripts
        crossOriginAttribute: false,
        proxies: {
            // lame workaround for opus-recorder
            '/encoderWorker.min.js': '/base/node_modules/opus-recorder/dist/encoderWorker.min.js',
            '/encoderWorker.min.wasm': '/base/node_modules/opus-recorder/dist/encoderWorker.min.wasm'
        },
        mime: {
            'application/wasm': ['wasm']
        },
        preprocessors: {
            'test/**/*.spec.js': ['webpack'],

            // source files to generate coverage for,
            // do not include tests or libraries
            'src/js/**/*.js': ['coverage']
        },
        webpackMiddleware: {
            stats: 'errors-only'
        },
        plugins: [
            'karma-webpack',
            'karma-jasmine',
            'karma-jasmine-matchers',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-safari-launcher',
            'karma-edge-launcher',
            'karma-coverage',
            'karma-coveralls',
            'karma-verbose-reporter',
            'karma-host-environment',
            'karma-detect-browsers'
        ],
        detectBrowsers: {
            enabled: true,
            usePhantomJS: false,
            preferHeadless: true,

            postDetection: function(availableBrowsers) {
                if (availableBrowsers.length > 1) {
                    // use custom browser launchers
                    var result = availableBrowsers;
                    let cd = availableBrowsers.indexOf('ChromeHeadless');
                    if (cd > -1) {
                        availableBrowsers[cd] = 'Chrome_dev';
                    }
                    let fd = availableBrowsers.indexOf('FirefoxHeadless');
                    if (fd > -1) {
                        availableBrowsers[fd] = 'Firefox_dev';
                    }
                    let fh = availableBrowsers.indexOf('Firefox');
                    if (fh > -1) {
                        availableBrowsers[fh] = 'Firefox_dev';
                    }
                    let ch = availableBrowsers.indexOf('ChromiumHeadless');
                    if (ch > -1) {
                        availableBrowsers[ch] = 'Chromium_dev';
                    }
                    return result;
                }
            }
        },
        captureConsole: true,
        browserNoActivityTimeout: 50000,
        colors: true,
        reporters: ['verbose', 'progress', 'coverage'],
        coverageReporter: {
            type: 'html',
            // specify a common output directory
            dir: 'coverage'
        },
        webpack: webpackConfig,
        customLaunchers: {
            Chrome_dev: {
                base: 'ChromeHeadless',
                flags: chromeFlags
            },
            Chromium_dev: {
                base: 'ChromiumHeadless',
                flags: chromeFlags
            },
            Firefox_dev: {
                base: 'FirefoxHeadless',
                prefs: firefoxFlags
            }
        }
    };

    if (ci) {
        configuration.browsers = ['Chrome_dev', 'Firefox_dev'];
        configuration.singleRun = true;
        configuration.detectBrowsers.enabled = false;

        if (process.env.TRAVIS) {
            // enable coveralls
            configuration.reporters.push('coveralls');
            // lcov or lcovonly are required for generating lcov.info files
            configuration.coverageReporter.type = 'lcov';
        }
    }

    config.set(configuration);
};
