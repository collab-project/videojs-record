const fs = require('fs');
const http = require('http');
const uuid = require('uuid/v5');
const sockjs = require('sockjs');
const colors = require('colors/safe');
const node_opus = require('node-opus');
const node_static = require('node-static');

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

