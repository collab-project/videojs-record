/**
 * @file main.js
 * @since 2.2.0
 */

const path = require('path');
const webpack = require('webpack');
const datefns = require('date-fns');

const year = datefns.format(new Date(), 'YYYY');
const rootDir = path.resolve(__dirname, '..', '..');
const pckg = require(path.join(rootDir, 'package.json'));
const CopyWebpackPlugin = require('copy-webpack-plugin');

// library banner with copyright and version info
let jsBanner = `${pckg.name}
@version ${pckg.version}
@see ${pckg.homepage}
@copyright 2014-${year} ${pckg.author}
@license ${pckg.license}`;
let jsBannerPlugin = new webpack.BannerPlugin({
    banner: jsBanner,
    test: /\.js$/
});

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
        jsBannerPlugin,
        copyFontsPlugin
    ]
};
