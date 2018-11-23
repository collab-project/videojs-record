/**
 * @file common.js
 * @since 2.2.0
 */

const path = require('path');
const webpack = require('webpack');
const rootDir = path.resolve(__dirname, '..', '..');
const pckg = require(path.join(rootDir, 'package.json'));
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// inject JS version number
let jsVersionPlugin = new webpack.DefinePlugin({
    '__VERSION__': JSON.stringify(pckg.version)
});

// add CSS banner with version info
let cssBanner = `/*!
Default styles for ${pckg.name} ${pckg.version}
*/`;
let cssBannerPlugin = new webpack.BannerPlugin({
    banner: cssBanner,
    raw: true,
    test: /\.css$/
});

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
            },
            {
                test: /\.scss$/,
                exclude: /(node_modules|bower_components|test)/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.woff2?$|\.ttf$|\.svg$/,
                exclude: /(node_modules|bower_components|test)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        // byte limit to inline files as Data URL
                        limit: 1000,
                        name: '../fonts/[name].[ext]',
                        emitFile: false
                    }
                }]
            }
        ]
    },
    plugins: [
        jsVersionPlugin,
        cssBannerPlugin
    ]
};
