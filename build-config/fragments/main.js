/**
 * @file main.js
 * @since 2.2.0
 */

const path = require('path');
const moment = require('moment');
const webpack = require('webpack');
const time = moment().format('YYYY');
const rootDir = path.resolve(__dirname, '..', '..');
const pckg = require(path.join(rootDir, 'package.json'));
const CopyWebpackPlugin = require('copy-webpack-plugin');

// library banner with copyright and version info
var jsBanner = `${pckg.name}
@version ${pckg.version}
@see ${pckg.homepage}
@copyright 2014-${time} ${pckg.author}
@license ${pckg.license}`;
var jsBannerPlugin = new webpack.BannerPlugin({
    banner: jsBanner,
    test: /\.js$/
});

// copy fonts to dist
var copyFontsPlugin = new CopyWebpackPlugin([
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
        jsBannerPlugin,
        copyFontsPlugin
    ]
};
