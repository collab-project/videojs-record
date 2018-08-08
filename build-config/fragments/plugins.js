/**
 * @file plugins.js
 * @since 2.2.0
 */

const path = require('path');
const moment = require('moment');
const webpack = require('webpack');
const time = moment().format('YYYY');
const rootDir = path.resolve(__dirname, '..', '..');
const pckg = require(path.join(rootDir, 'package.json'));

// plugin banner with copyright and version info
var jsBanner = `[name] plugin for ${pckg.name}
@version ${pckg.version}
@see ${pckg.homepage}
@copyright 2014-${time} ${pckg.author}
@license ${pckg.license}`;
var jsBannerPlugin = new webpack.BannerPlugin({
    banner: jsBanner,
    test: /\.js$/
});

/**
 * buildPluginEntry
 *
 * @param {Array} plugins Name of plugin file in src/js/plugins (and strips off
 *     the '-plugin' part of the filename).
 *
 * @returns {object} Entry object { name: nameUrl }
 */
function buildPluginEntry(plugins) {
    const result = {};
    plugins.forEach(
        plugin =>
            (result[plugin.split('-plugin')[0]] = path.join(
                rootDir, 'src', 'js', 'plugins', plugin
            ))
    );
    return result;
}

module.exports = {
    entry: buildPluginEntry([
        'lamejs-plugin',
        'libvorbis-plugin',
        'opus-recorder-plugin',
        'recorderjs-plugin'
    ]),
    output: {
        path: path.join(rootDir, 'dist', 'plugins'),
        filename: 'videojs.record.[name].js',
        library: ['VideojsRecord', '[name]']
    },
    plugins: [
        jsBannerPlugin
    ]
};
