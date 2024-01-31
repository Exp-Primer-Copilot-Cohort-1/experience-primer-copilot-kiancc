// Create web server
var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

// Create web server
http.createServer(function (req, res) {
  var pathname = url.parse(req.url).pathname;
  console.log("Request for " + pathname + " received.");

  // Read and display content from index.html
  fs.readFile('index.html', function(err, data) {
    if (err) {
      console.log(err);
      res.writeHead(404, {'Content-Type': 'text/html'});
    } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data.toString());
    }
    res.end();
  });
}).listen(8080);

// Create web socket server
var io = require('socket.io').listen(8000);

var comments = [];

// Listen for connection event
io.sockets.on('connection', function (socket) {
  console.log("Connection " + socket.id + " accepted.");

  // Listen for disconnect event
  socket.on('disconnect', function () {
    console.log("Connection " + socket.id + " terminated.");
  });

  // Listen for comment event
  socket.on('comment', function (data) {
    comments.push(data);
    io.sockets.emit('comment', data);
  });

  // Listen for comments event
  socket.on('comments', function (data) {
    for (var i = 0; i < comments.length; i++) {
      socket.emit('comment', comments[i]);
    }
  });
});