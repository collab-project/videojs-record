/**
 * @file main.js
 * @since 2.2.0
 */

const path = require('path');
const webpack = require('webpack');
const banner = require('./banner');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const rootDir = path.resolve(__dirname, '..', '..');

// copy fonts to dist directory
let copyFontsPlugin = new CopyWebpackPlugin({
    patterns: [{
        from: 'src/fonts/*',
        to: 'fonts/[name].[ext]',
        globOptions: {
            dot: false,
            ignore: ['**/*.json', '**/*.md']
        }
    }]
});

module.exports = {
    entry: {
        code: {
            import: path.join(rootDir, 'src', 'js', 'videojs.record.js'),
            filename: 'videojs.record.js'
        },
        style: {
            import: path.join(rootDir, 'src', 'css', 'videojs.record.scss')
        }
    },
    output: {
        path: path.join(rootDir, 'dist'),
        library: 'VideojsRecord'
    },
    plugins: [
        banner.libBanner,
        copyFontsPlugin
    ]
};
