/**
 * Build the plugins:
 * 
 *  - pull through Babel
 *  - create collapsed bundle
 *  - minify
 *  
 * @file build-plugins.js
 */

var browserify = require('browserify');
var bannerize = require('bannerize');
var collapse = require('bundle-collapser/plugin');
var color = require('colour');

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var mkdirp = require('mkdirp');

var pluginsDestDir = 'dist/plugins/';

// search for plugins
glob('src/js/plugins/*.js', function(err, files) {

    console.log();
    console.log(color.green('OK') + ': Build ' + files.length + ' plugins');

    files.forEach(function(pluginPath) {
        // get paths
        var fileName = pluginPath.substr(pluginPath.lastIndexOf('/') + 1);
        var dirName = pluginPath.split(fileName)[0];
        var pluginName = fileName.replace('.js', '');
        var minifiedName = fileName.replace('.js', '.min.js');
        var pluginDestPath = pluginsDestDir + fileName;
        var pluginDestPathMinified = pluginsDestDir + minifiedName;

        mkdirp(pluginsDestDir, function(err) { 
            var browserify_opts = {
                standalone: pluginName,
                plugin: [collapse]
            };
            // bundle
            var bundler = browserify(pluginPath, browserify_opts);
            bundler.transform('babelify')
            .transform('browserify-shim', {})
            .bundle()
            .pipe(fs.createWriteStream(pluginDestPath))

            // minify
            bundler = browserify(pluginDestPath, browserify_opts);
            bundler.transform('babelify')
            .transform('browserify-shim', {})
            .transform('uglifyify', { global: true  })
            .bundle()
            .pipe(fs.createWriteStream(pluginDestPathMinified))

            // banner
            bannerize(pluginDestPathMinified, {
                banner: 'scripts/banner.ejs',
                cwd: path.join(__dirname, '..')
            });

            console.log(' - ' + pluginName + ' => ' + pluginDestPathMinified);
        });
    });

    console.log();
});
