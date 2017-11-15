/**
 * Build the plugins.
 *
 * Steps executed for each plugin in the src/js/plugins directory:
 *
 *  - babelify
 *  - create collapsed bundle
 *  - minify
 *  - add copyright header
 *
 * @file build-plugins.js
 * @since 2.0.0
 */

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var browserify = require('browserify');
var banner = require('browserify-banner');
var collapse = require('bundle-collapser/plugin');
var color = require('colour');
var mkdirp = require('mkdirp');

var pluginsDestDir = 'dist/plugins/';
var bannerPath = 'scripts/banner.ejs';
var fileName, dirName, pluginName, minifiedName, pluginDestPath,
    pluginDestPathMinified, browserify_opts, pjson, bundler;

mkdirp(pluginsDestDir, function(err) {
    // search for plugins
    glob('src/js/plugins/*.js', function(err, files) {

        console.log();
        console.log(color.green('OK') + ': Build ' + files.length + ' plugins');

        files.forEach(function(pluginPath) {
            fileName = pluginPath.substr(pluginPath.lastIndexOf('/') + 1);
            dirName = pluginPath.split(fileName)[0];
            pluginName = fileName.replace('-plugin.js', '');
            minifiedName = fileName.replace('-plugin.js', '.min.js');
            pluginDestPath = pluginsDestDir + 'videojs.record.' + pluginName + '.js';
            pluginDestPathMinified = pluginsDestDir + 'videojs.record.' + minifiedName;
            browserify_opts = {
                standalone: pluginName,
                plugin: [
                    collapse
                ]
            };

            // add plugin name to banner
            pjson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            pjson.name = pluginName + ' plugin for videojs-record';

            // bundle
            browserify(pluginPath, browserify_opts)
            .transform('babelify')
            .transform('browserify-shim')
            .plugin(banner, {
                pkg: pjson,
                file: bannerPath
            })
            .bundle()
            .pipe(fs.createWriteStream(pluginDestPath))

            // minify
            browserify(pluginPath, browserify_opts)
            .transform('babelify')
            .transform('browserify-shim')
            .transform('uglifyify', {
                output: {
                    // output options
                    comments: false
                },
                ie8: true,
                warnings: false
            })
            .plugin(banner, {
                pkg: pjson,
                file: bannerPath
            })
            .bundle()
            .pipe(fs.createWriteStream(pluginDestPathMinified))

            console.log(' - ' + pluginName + ' => ' + pluginDestPathMinified);
        });

        console.log();
    });
});
