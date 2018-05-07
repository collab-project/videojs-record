/**
 * @file dev.js
 * @since 2.2.0
 */

var path = require('path');
var fs = require('fs');
var util = require('util');
var formidable = require('formidable');
var colors = require('colors/safe');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        contentBase: [path.resolve(__dirname, '..', '..')],
        publicPath: '/',
        watchContentBase: true,
        before(app){
            // file upload handler for examples
            app.post('/upload', function(req, res) {
                // save uploaded file
                var form = new formidable.IncomingForm();
                form.uploadDir = 'uploads';
                form.keepExtensions = true;

                console.log('saving uploaded file...');

                form.on('fileBegin', function(name, file) {
                    // use original filename in this example
                    file.path = form.uploadDir + '/' + file.name;
                    console.log(colors.yellow('filename:', file.name));
                });

                form.on('end', function() {
                    console.log(colors.green('saved file.'));
                    console.log('');
                });

                form.parse(req, function(err, fields, files) {
                    res.writeHead(200, {'content-type': 'text/plain'});
                    res.write('received upload:\n\n');
                    res.end(util.inspect({fields: fields, files: files}));
                });

                return;
            });
        }
    }
};
