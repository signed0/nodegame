
var express = require('express'),
    io = require('socket.io'),
    path = require('path'),
    httpServer = express.createServer(),
    config = {},
    socketServer;

config.html = './client';

config.http = {};
config.http.port = 6090;


// start listening for requests
httpServer.listen(config.http.port);
socketServer = io.listen(httpServer);


// set up the html responses
httpServer.get('/', function(request, response) {
    response.sendfile(path.join(config.html, 'index.html'));
});
httpServer.get('/main.js', function(request, response) {
    response.sendfile(path.join(config.html, 'main.js'));
});


// set up the socket responses
socketServer.sockets.on('connection', function (socket) {


    // get the user information

    // add the user to the list of users

    // tell everybody that a new user has joined


});

