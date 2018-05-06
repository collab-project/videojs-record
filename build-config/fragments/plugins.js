const path = require('path');

/**
 * buildPluginEntry - Description
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
            (result[plugin.split('-plugin')[0]] = path.resolve(
                __dirname,
                '..',
                '..',
                'src',
                'js',
                'plugins',
                plugin
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
        path: path.resolve(__dirname, '..', '..', 'dist', 'plugins'),
        filename: 'videojs.record.[name].js',
        library: ['VideojsRecord', '[name]']
    }
};
