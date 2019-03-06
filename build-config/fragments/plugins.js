/**
 * @file plugins.js
 * @since 2.2.0
 */

const fs = require('fs');
const path = require('path');
const banner = require('./banner');
const webpack = require('webpack');

const rootDir = path.resolve(__dirname, '..', '..');
const pluginSrcDir = path.join(rootDir, 'src', 'js', 'plugins');

// find plugins
const PLUGINS = [];
fs.readdirSync(pluginSrcDir).forEach(plugin => {
    PLUGINS.push(plugin);
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
            (result[plugin.split('-plugin')[0]] = path.join(pluginSrcDir, plugin))
    );
    return result;
}

module.exports = {
    entry: buildPluginEntry(PLUGINS),
    output: {
        path: path.join(rootDir, 'dist', 'plugins'),
        filename: 'videojs.record.[name].js',
        library: ['VideojsRecord', '[name]']
    },
    plugins: [banner.pluginBanner]
};
