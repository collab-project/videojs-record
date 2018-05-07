/**
 * @file main.js
 * @since 2.2.0
 */

const path = require('path');
const moment = require('moment');
const webpack = require('webpack');

const time = moment().format('YYYY');
const pckg = require(path.join(__dirname, '..', '..', 'package.json'));

// library banner with copyright and version info
var bannerPlugin = new webpack.BannerPlugin(
`${pckg.name}
@version ${pckg.version}
@see ${pckg.homepage}
@copyright 2014-${time} ${pckg.author}
@license ${pckg.license}`
);

module.exports = {
    entry: {
        'videojs.record': path.resolve(
            __dirname, '..', '..', 'src', 'js', 'videojs.record.js'
        )
    },
    output: {
        path: path.resolve(__dirname, '..', '..', 'dist'),
        filename: '[name].js',
        library: 'VideojsRecord'
    },
    plugins: [
        bannerPlugin
    ]
};
