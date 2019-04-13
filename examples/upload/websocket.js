/* eslint-disable no-console */

/**
 * Example websocket server for uploads.
 */

const http = require('http');
const sockjs = require('sockjs');
const colors = require('colors/safe');
const node_static = require('node-static');

// create websocket
const sockjs_upload = sockjs.createServer();

let index = 0;

sockjs_upload.on('connection', (conn) => {
    conn.on('data', (data) => {
        if (data === 'start') {
            //
            index = 0;

            console.log('');
            console.log(colors.yellow('started recording'));
            console.log('');
        } else if (data === 'stop') {
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
const static_directory = new node_static.Server(__dirname);
const server = http.createServer();
const port = 9999;
const host = '0.0.0.0';
server.addListener('request', (req, res) => {
    static_directory.serve(req, res);
});
server.addListener('upgrade', (req, res) => {
    res.end();
});
sockjs_upload.installHandlers(server, {prefix: '/upload-socket'});

console.log('');
console.log(colors.green(' [examples] Websocket upload server listening on ') +
            colors.yellow(host + ':' + port));
server.listen(port, host);
console.log('');

