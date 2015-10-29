var http = require('http');
var fs = require('fs');

var handleStatic, handleStream;

// An array where we will keep pointers to all our connections.
var connections = [];

// Main HTTP request handler
function handler(req, res) {
    // If we get our custom header, do streaming, if not; return the html file.
    if (req.headers['x-stream'] === 'rockon') {
        return handleStream(req, res);
    }
    handleStatic(req, res);
}

// Return the html file
handleStatic = function (req, res) {
    // Asynchronous file read.
    fs.readFile('./long-polling.html', 'utf8', function (err, data) {
        if (err) throw err;

        // If there is no error, send the contents of the html file as the HTTP body
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
}

// Handle a long polling request
handleStream = function (req, res) {

    // Don't respond the the request, just stash it in the array.
    connections.push(res);

    // Notice that our array will eventually blow out through memory because it never
    // is pruned, and keeps a pointer to every connection ever made to this server.
}

var server = http.createServer(handler);

process.stdin.resume();
process.stdin.setEncoding('utf8');

// When input on stdin is observed, send it to each of the connected clients.
process.stdin.on('data', function (data) {
    connections.forEach(function (res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(data);
    });
});

// Fire up the server
server.listen(8080, 'localhost', function () {
    console.log('server running');
});