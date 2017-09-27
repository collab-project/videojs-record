var browserify = require('browserify');
var bannerize = require('bannerize');
var collapse = require('bundle-collapser/plugin');
var UglifyJS = require('uglify-js');

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var mkdirp = require('mkdirp');

glob('src/js/plugins/*.js', function(err, files) {
    files.forEach(function(pluginPath) {
        // get paths
        var fileName = pluginPath.substr(pluginPath.lastIndexOf('/') + 1);
        var dirName = pluginPath.split(fileName)[0];
        var pluginName = fileName.replace('.js', '');
        var minifiedName = fileName.replace('.js', '.min.js');
        var pluginsDestDir = 'dist/plugins/';
        var pluginDestPath = pluginsDestDir + fileName;
        var pluginDestPathMinified = pluginsDestDir + minifiedName;

        console.log('-------');
        console.log(dirName);
        console.log(pluginName);
        console.log(minifiedName);
        console.log(pluginsDestDir);
        console.log(pluginDestPath);

        mkdirp(pluginsDestDir, function(err) { 
            var browserify_opts = {
                standalone: 'foo', //pluginName,
                debug: true,
                plugin: [collapse]
            };
            // bundle
            var bundler = browserify(pluginPath, browserify_opts);
            bundler.transform('babelify')
            .transform('browserify-shim', {})
            .bundle()
            .pipe(fs.createWriteStream(pluginDestPath))
            // minify
            //.transform('uglifyify', {sourceMap: false})
            //.pipe(fs.createWriteStream(pluginDestPathMinified))

            // banner
            /*bannerize(pluginsDestDir + minifiedName, {
                banner: 'scripts/banner.ejs',
                cwd: path.join(__dirname, '..')
            }).then(function () {
                console.log('Added banner to ' + pluginDestPathMinified);
            });*/
        });
    });
});
