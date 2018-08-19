/**
 * @file dev.js
 * @since 2.2.0
 */

const fs = require('fs');
const http = require('http');
const path = require('path');
const util = require('util');
const uuid = require('uuid');
const sockjs = require('sockjs');
const colors = require('colors/safe');
const formidable = require('formidable');
const node_static = require('node-static');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
            var sockjs_echo = sockjs.createServer();
            sockjs_echo.on('connection', function(conn) {
                conn.on('data', function(data) {

                    console.log('saving uploaded file...');

                    var fileName = uuid.v4() + '.ogg';
                    writeToDisk(data, fileName);

                    console.log(colors.green('saved file.'));
                    console.log('');
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
            sockjs_echo.installHandlers(server, {prefix: '/echo'});

            console.log('');
            console.log(colors.green(' [examples] Websocket server listening on ') +
                        colors.yellow('0.0.0.0:9999'));
            server.listen(9999, '0.0.0.0');
            console.log('');
        },
        proxy: {
            '/echo': {
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
