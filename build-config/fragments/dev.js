/**
 * @file dev.js
 * @since 2.2.0
 */

const fs = require('fs');
const http = require('http');
const path = require('path');
const util = require('util');
const uuid = require('uuid/v5');
const sockjs = require('sockjs');
const colors = require('colors/safe');
const formidable = require('formidable');
const node_static = require('node-static');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

var opus = require('node-opus');

const contentBase = path.resolve(__dirname, '..', '..');

function writeToDisk(dataURL, fileName) {
    var fileExtension = fileName.split('.').pop(),
        fileRootNameWithBase = './uploads/' + fileName,
        filePath = fileRootNameWithBase,
        fileID = 2,
        fileBuffer;

    console.log(colors.yellow('filename:', filePath));

    // @todo return the new filename to client
    while (fs.existsSync(filePath)) {
        filePath = fileRootNameWithBase + '(' + fileID + ').' + fileExtension;
        fileID += 1;
    }

    dataURL = dataURL.split(',').pop();
    fileBuffer = new Buffer(dataURL, 'base64');
    fs.writeFileSync(filePath, fileBuffer);
}

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        contentBase: [contentBase],
        publicPath: '/',
        watchContentBase: true,
        // webpack-dev-server middleware
        before(app) {
            // =============================================
            // use proper mime-type for wasm files
            // =============================================
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
            console.log('');
            console.log(colors.green(' [examples] wasm mime-type handler ready'));
            console.log('');

            // =============================================
            // file upload handler for simple upload example
            // =============================================
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
            console.log('');
            console.log(colors.green(' [examples] /upload handler ready'));
            console.log('');

            // ===================================================
            // streaming file upload handler for websocket example
            // ===================================================
            var sockjs_upload = sockjs.createServer();
            sockjs_upload.on('connection', function(conn) {
                conn.on('data', function(data) {

                    console.log('received uploaded buffer...', data);

                    // XXX: AudioBuffer to eventual file

                    /*
                    var fileName = uuid() + '.ogg';
                    writeToDisk(data, fileName);

                    console.log(colors.green('saved file.'));
                    console.log('');
                    */
                });
            });

            // static files server
            var static_directory = new node_static.Server(__dirname);
            var server = http.createServer();
            server.addListener('request', function(req, res) {
                static_directory.serve(req, res);
            });
            server.addListener('upgrade', function(req,res){
                res.end();
            });
            sockjs_upload.installHandlers(server, {prefix: '/upload-socket'});

            console.log('');
            console.log(colors.green(' [examples] Websocket upload server listening on ') +
                        colors.yellow('0.0.0.0:9999'));
            server.listen(9999, '0.0.0.0');
            console.log('');
        },
        proxy: {
            '/upload-socket': {
                target: 'http://0.0.0.0:9999',
                ws: true
            }
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        })
    ]
};
