/* eslint-disable no-console */

/**
 * Example websocket server for uploads.
 */


const http = require('http');
const sockjs = require('sockjs');
const datefns = require('date-fns');
const colors = require('colors/safe');
const node_static = require('node-static');
const timestamp = require('log-timestamp')(function() { return '[' + datefns.format(new Date(), 'YYYY/MM/DD HH:mm:ss.SSS') + '] %s'; });

let index = 0;

// create websocket
const sockjs_upload = sockjs.createServer();

// listen for connections
sockjs_upload.on('connection', (conn) => {
    conn.on('data', data => {
        if (data === 'start') {
            // started recording
            index = 0;

            console.log('');
            console.log(colors.yellow('started recording.'));
            console.log('');
        } else if (data === 'stop') {
            // stopped recording
            console.log('');
            console.log(colors.green('finished recording.'));
            console.log('');
        } else if (data) {
            // received data
            index++;

            console.log(
                colors.blue(' received data [' + colors.cyan(index) + ']:'),
                data
            );
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

// print startup message
console.log('');
console.log(colors.green(' [examples] Websocket upload server listening on ') +
            colors.yellow(host + ':' + port));
server.listen(port, host);
console.log('');

