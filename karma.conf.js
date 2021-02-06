/**
 * @since 2.2.0
 */

process.traceDeprecation = true;
process.env.BABEL_ENV = 'test';

const path = require('path');
require('@babel/register');

let ci = process.env.CI || process.env.APPVEYOR;
let webpackConfig = require('./build-config/webpack.prod.main.js');
let support_dir = path.resolve(__dirname, 'test', 'support');
let fakeAudioStream = path.join(support_dir, 'Front_Center.wav');
let fakeVideoStream = path.join(support_dir, 'bus_qcif_7.5fps.y4m');

//-------------------------------------------
// Chrome CLI options
//-------------------------------------------
// http://peter.sh/experiments/chromium-command-line-switches/
const chromeFlags = [
    '--no-sandbox',
    '--disable-gpu',
    '--no-first-run',
    '--noerrdialogs',
    '--no-default-browser-check',
    '--use-fake-device-for-media-stream',
    '--use-fake-ui-for-media-stream',
    '--use-file-for-fake-audio-capture=' + fakeAudioStream,
    '--use-file-for-fake-video-capture=' + fakeVideoStream,
    '--autoplay-policy=no-user-gesture-required',
    '--user-data-dir=' + path.resolve('.chrome'),
    '--disable-translate',
    '--disable-extensions',
    '--disable-infobars',
    '--ignore-certificate-errors',
    '--allow-insecure-localhost',
    '--enable-experimental-web-platform-features',
    '--js-flags=--max-old-space-size=8196'
];
//-------------------------------------------
// Firefox CLI options
//-------------------------------------------
const firefoxFlags = {
    'media.navigator.permission.disabled': true,
    'media.navigator.streams.fake': true,
    'media.getusermedia.screensharing.enabled': true,
    'media.setsinkid.enabled': true,
    'javascript.options.streams': true,
    // devtools
    'devtools.theme': 'dark',
    'devtools.webconsole.timestampMessages': true,
    'devtools.toolbox.host': 'right',
    'devtools.toolbox.selectedTool': 'webconsole',
    'devtools.chrome.enabled': true,
    // disable autoplay blocking, see:
    // https://www.ghacks.net/2018/09/21/firefox-improved-autoplay-blocking/
    'media.autoplay.default': 1,
    'media.autoplay.ask-permission': false,
    'media.autoplay.enabled.user-gestures-needed': false,
    'media.autoplay.block-webaudio': false,
    // disable update and startup
    'extensions.update.enabled': false,
    'app.update.enabled': false,
    'browser.startup.page': 0,
    'startup.homepage_welcome_url': '',
    'browser.shell.checkDefaultBrowser': false
};

module.exports = function(config) {
    let configuration = {
        basePath: '',
        frameworks: ['jasmine', 'jasmine-matchers', 'host-environment', 'detectBrowsers', 'webpack'],
        hostname: 'localhost',
        port: 9876,
        logLevel: config.LOG_INFO,
        singleRun: true, // enable for headless testing
        autoWatch: false,
        files: [
            // -------------------------------------------
            // demo files
            // -------------------------------------------
            {
                pattern: 'test/support/*',
                included: false,
                watched: false,
                served: true
            },
            // style
            'node_modules/video.js/dist/video-js.css',
            'node_modules/videojs-wavesurfer/dist/css/videojs.wavesurfer.css',

            // library dependencies
            'node_modules/video.js/dist/video.js',
            'node_modules/webrtc-adapter/out/adapter.js',
            'node_modules/recordrtc/RecordRTC.js',

            // -------------------------------------------
            // third-party dependencies for audio-only
            // -------------------------------------------
            // wavesurfer.js
            'node_modules/wavesurfer.js/dist/wavesurfer.min.js',
            'node_modules/wavesurfer.js/dist/plugin/wavesurfer.microphone.js',
            // videojs-wavesurfer
            'node_modules/videojs-wavesurfer/dist/videojs.wavesurfer.js',

            // -------------------------------------------
            // plugin style
            // -------------------------------------------
            'dist/css/videojs.record.css',

            // -----------------------------------------------
            // third-party dependencies for (optional) plugins
            // -----------------------------------------------
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
            // opus-media-recorder
            {pattern: 'node_modules/opus-media-recorder/encoderWorker.umd.js', included: false, served: true},
            {pattern: 'node_modules/opus-media-recorder/*.wasm', included: false, served: true, type: 'wasm'},
            // vmsg
            {pattern: 'node_modules/vmsg/*.wasm', included: false, served: true, type: 'wasm'},
            // web streams API polyfill to support Firefox (for webm-wasm)
            'node_modules/@mattiasbuelens/web-streams-polyfill/dist/polyfill.min.js',
            // webm-wasm
            {pattern: 'node_modules/webm-wasm/dist/webm-worker.js', included: false, served: true},
            {pattern: 'node_modules/webm-wasm/dist/webm-wasm.wasm', included: false, served: true, type: 'wasm'},
            // ffmpeg.js
            {pattern: 'node_modules/ffmpeg.js/ffmpeg-worker-mp4.js', included: false, served: true},
            // ffmpeg.wasm
            {pattern: 'node_modules/@ffmpeg/ffmpeg/dist/ffmpeg.min.js', included: false, served: true},
            {pattern: 'node_modules/@ffmpeg/core/dist/ffmpeg-core.js', included: false, served: true},
            // gif-recorder: only available on CDN
            'https://cdn.webrtc-experiment.com/gif-recorder.js',

            // -------------------------------------------
            // specs
            // -------------------------------------------
            {pattern: 'test/**/*.spec.js', watched: false}
        ],
        // for CDN scripts
        crossOriginAttribute: false,
        proxies: {
            // necessary workaround for opus-recorder plugin
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
            'karma-edge-launcher',
            'karma-coverage',
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
                    let result = availableBrowsers;
                    let cr = availableBrowsers.indexOf('Chrome');
                    if (cr > -1) {
                        availableBrowsers[cd] = 'Chrome_dev';
                    }
                    let cd = availableBrowsers.indexOf('ChromeHeadless');
                    if (cd > -1) {
                        availableBrowsers[cd] = 'Chrome_headless';
                    }
                    let fd = availableBrowsers.indexOf('FirefoxHeadless');
                    if (fd > -1) {
                        availableBrowsers[fd] = 'Firefox_headless';
                    }
                    let fh = availableBrowsers.indexOf('Firefox');
                    if (fh > -1) {
                        availableBrowsers[fh] = 'Firefox_dev';
                    }
                    let ch = availableBrowsers.indexOf('ChromiumHeadless');
                    if (ch > -1) {
                        availableBrowsers[ch] = 'Chromium_dev';
                    }
                    let ce = availableBrowsers.indexOf('Chromium');
                    if (ce > -1) {
                        availableBrowsers[ce] = 'Chromium_dev';
                    }
                    // ignore IE
                    let ie = availableBrowsers.indexOf('IE');
                    if (ie > -1) {
                        availableBrowsers.splice(ie, 1);
                    }
                    // ignore Safari (until it's supported...)
                    let safariTechPreview = availableBrowsers.indexOf('SafariTechPreview');
                    if (safariTechPreview > -1) {
                        availableBrowsers.splice(safariTechPreview, 1);
                    }
                    let safari = availableBrowsers.indexOf('Safari');
                    if (safari > -1) {
                        availableBrowsers.splice(safari, 1);
                    }

                    return result;
                }
            }
        },
        captureConsole: true,
        concurrency: 1,
        browserSocketTimeout: 20000,
        browserDisconnectTimeout : 10000,
        browserDisconnectTolerance : 1,
        browserNoActivityTimeout : 60000,
        colors: true,
        reporters: ['verbose', 'progress', 'coverage'],
        coverageReporter: {
            dir: 'coverage',
            reporters: [
                { type: 'html', subdir: 'html' },
                { type: 'lcov', subdir: 'lcov' }
            ]
        },
        webpack: webpackConfig,
        customLaunchers: {
            Chrome_dev: {
                base: 'Chrome',
                flags: chromeFlags,
                chromeDataDir: path.resolve(__dirname, '.chrome')
            },
            Chrome_headless: {
                base: 'ChromeHeadless',
                flags: chromeFlags
            },
            Chromium_dev: {
                base: 'ChromiumHeadless',
                flags: chromeFlags
            },
            Firefox_dev: {
                base: 'Firefox',
                prefs: firefoxFlags
            },
            Firefox_headless: {
                base: 'FirefoxHeadless',
                prefs: firefoxFlags
            }
        }
    };

    if (ci) {
        configuration.browsers = ['Chrome_headless', 'Firefox_headless'];
        configuration.singleRun = true;
        configuration.detectBrowsers.enabled = false;
    }

    config.set(configuration);
};
