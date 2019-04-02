/**
 * @file main.js
 * @since 2.2.0
 */

const path = require('path');
const webpack = require('webpack');
const banner = require('./banner');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const rootDir = path.resolve(__dirname, '..', '..');

// copy fonts to dist
let copyFontsPlugin = new CopyWebpackPlugin([
    {
        from: 'src/fonts/*',
        to: 'fonts',
        flatten: true,
        ignore: ['*.json', '*.md']
    }
]);

module.exports = {
    entry: {
        'videojs.record': [
            // JS
            path.join(rootDir, 'src', 'js', 'videojs.record.js'),
            // SCSS
            path.join(rootDir, 'src', 'css', 'videojs.record.scss')
        ]
    },
    output: {
        path: path.join(rootDir, 'dist'),
        filename: '[name].js',
        library: 'VideojsRecord'
    },
    plugins: [
        banner.libBanner,
        copyFontsPlugin
    ]
};
