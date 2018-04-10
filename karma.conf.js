/**
 * @since 2.2.0
 */

process.env.BABEL_ENV = 'test';

require('babel-register');

var webpackConfig = require('./build-config/webpack.prod.main.js');

var chromeFlags = [
    '--use-fake-device-for-media-stream',
    '--use-file-for-fake-audio-capture=test/support/Front_Center.wav',
    '--use-file-for-fake-video-capture=test/support/bus_qcif_7.5fps.y4m'
];

module.exports = function(config) {
    var configuration = {
        basePath: '',
        frameworks: ['jasmine', 'jasmine-matchers', 'sinon'],
        hostname: 'localhost',
        port: 9876,
        logLevel: config.LOG_INFO,
        singleRun: true,
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

            // dependencies
            'node_modules/video.js/dist/video.js',
            'node_modules/wavesurfer.js/dist/wavesurfer.js',
            'node_modules/wavesurfer.js/dist/plugin/wavesurfer.microphone.js',
            'node_modules/videojs-wavesurfer/dist/videojs.wavesurfer.js',

            // specs
            'test/**/*.spec.js'
        ],
        preprocessors: {
            'test/**/*.spec.js': ['webpack'],

            // source files, that you want to generate coverage for
            // do not include tests or libraries
            'src/js/**/*.js': ['coverage']
        },
        webpackMiddleware: {
            stats: 'errors-only'
        },
        plugins: [
            'karma-webpack',
            'karma-jasmine',
            'karma-sinon',
            'karma-jasmine-matchers',
            'karma-chrome-launcher',
            'karma-coverage',
            'karma-verbose-reporter'
        ],
        browsers: ['Chrome_dev'],
        captureConsole: true,
        colors: true,
        reporters: ['verbose', 'progress', 'coverage'],
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },
        webpack: webpackConfig,
        customLaunchers: {
            Chrome_dev: {
                base: 'Chrome',
                flags: chromeFlags
            },
            Chrome_travis_ci: {
                base: 'ChromeHeadless',
                flags: chromeFlags
            }
        }
    };

    if (process.env.TRAVIS) {
        configuration.browsers = ['Chrome_travis_ci'];
    }

    config.set(configuration);
};
