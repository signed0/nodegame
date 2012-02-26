
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


function onUserJoined(socket) {
    /* This function applies functionality to the socket after the user has
     * joined the game
     */

    // return the list of connected users
    // iterate through all the sockets, building up a list of users
    socket.on('get-users', function() {
        var users = [];

        socketServer.sockets.clients().forEach(function(s) {
            s.get('username', function(err, username) {
                users.push({
                    username: username
                });
            });
        });

        socket.emit('user-list', users);
    });


    // disconnect the user, and broadcast he or she has left
    socket.on('disconnect', function() {
        socket.get('username', function(error, username) {
            socket.broadcast.emit('left', {username: username});
        });
    });

}

// set up the socket responses
socketServer.sockets.on('connection', function (socket) {

    // listen for a user to join the room
    // store the username, then bind the socket to the other events that
    // the user can use once he/she has connected
    socket.on('join', function(data) {
        socket.set('username', data.username, function() {
            socket.broadcast.emit('joined', {username: data.username});
            onUserJoined(socket);
        });
    });

});

