/**
 * @file common.js
 * @since 2.2.0
 */

const path = require('path');
const webpack = require('webpack');

const pckg = require(path.join(__dirname, '..', '..', 'package.json'));

// inject version number
var replaceVersionPlugin = new webpack.DefinePlugin({
    '__VERSION__': JSON.stringify(pckg.version)
});
let rootDir = path.resolve(__dirname, '..', '..');

module.exports = {
    context: rootDir,
    output: {
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    performance: {
        hints: false
    },
    // specify dependencies for the library that are not resolved by webpack,
    // but become dependencies of the output: they are imported from the
    // environment during runtime.
    externals: [
        {'video.js': 'videojs'},
        {'wavesurfer.js': 'WaveSurfer'},
        {'recordrtc': 'RecordRTC'}
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(rootDir, 'src', 'js'),
                exclude: /(node_modules|bower_components|test)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [
        replaceVersionPlugin
    ]
};
