/**
 * @file dev.js
 * @since 2.2.0
 */

const path = require('path');
const fs = require('fs');
const util = require('util');
const formidable = require('formidable');
const colors = require('colors/safe');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const contentBase = path.resolve(__dirname, '..', '..');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        contentBase: [contentBase],
        publicPath: '/',
        watchContentBase: true,
        // webpack-dev-server middleware
        before(app) {
            // use proper mime-type for wasm files
            app.get('*.wasm', function(req, res, next) {
                var options = {
                    root: contentBase,
                    dotfiles: 'deny',
                    headers: {
                        'Content-Type': 'application/wasm'
                    }
                };
                res.sendFile(req.url, options, function (err) {
                    if (err) {
                        next(err);
                    }
                });
            });
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
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        })
    ]
};
