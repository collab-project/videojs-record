/**
 * Example websocket server for uploads.
 */

const http = require('http');
const sockjs = require('sockjs');
const colors = require('colors/safe');
const node_static = require('node-static');

// create websocket
var sockjs_upload = sockjs.createServer();

var index = 0;

sockjs_upload.on('connection', function(conn) {
    conn.on('data', function(data) {
        if (data == 'start') {
            //
            index = 0;

            console.log('');
            console.log(colors.yellow('started recording'));
            console.log('');
        } else if (data == 'stop') {
            //
            console.log('');
            console.log(colors.green('finished recording'));
            console.log('');
        } else {
            //
            index++;

            console.log(colors.blue(' received data [' + colors.cyan(index) + ']...'), data);
        }
    });
});

// static files server
var static_directory = new node_static.Server(__dirname);
var server = http.createServer();
var port = 9999;
var host = '0.0.0.0';
server.addListener('request', function(req, res) {
    static_directory.serve(req, res);
});
server.addListener('upgrade', function(req,res){
    res.end();
});
sockjs_upload.installHandlers(server, {prefix: '/upload-socket'});

console.log('');
console.log(colors.green(' [examples] Websocket upload server listening on ') +
            colors.yellow(host + ':' + port));
server.listen(port, host);
console.log('');

