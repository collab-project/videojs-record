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
        var pluginsDestDir = 'dist-test/plugins/';
        var pluginDestPath = pluginsDestDir + fileName;

        console.log('-------');
        console.log(dirName);
        console.log(pluginName);
        console.log(minifiedName);
        console.log(pluginsDestDir);
        console.log(pluginDestPath);

        // bundle
        mkdirp(pluginsDestDir, function(err) { 
            var browserify_opts = {
                standalone: pluginName,
                debug: true,
                plugin: [collapse]
            };
            browserify(pluginPath, browserify_opts)
            .transform('babelify')
            .transform('browserify-shim', {global: true})
            .bundle()
            .pipe(fs.createWriteStream(pluginDestPath));

            // banner
            bannerize(pluginDestPath, {
                banner: 'scripts/banner.ejs',
                cwd: path.join(__dirname, '..')
            }).then(function () {
                console.log('Added banner to ' + pluginDestPath);
            });

            // get a reference to the plugin
            //var code = fs.readFileSync(pluginDestPath, "utf8");
            //var result = UglifyJS.minify(code, { mangle: { toplevel: true } });
            //console.log(result);
            /*
            console.log(result.code);
            fs.writeFile(pluginsDestDir + minifiedName, result.code, function(err) {
                if (err) {
                    console.log(err);
                }
            });
            */
        });
    });
});

      