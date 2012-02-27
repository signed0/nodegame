
var express = require('express'),
    io = require('socket.io'),
    path = require('path'),
    Game = require('./Game'),
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

function onGameStarted(socket, assignment) {

}

function onUserJoined(socket) {
    /* This function applies functionality to the socket after the user has
     * joined the game
     */

    // return the list of connected users
    // iterate through all the sockets, building up a list of users
    socket.on('get-users', function() {
        var users = [];

        socketServer.sockets.clients().forEach(function(s) {
            s.get('user', function(err, user) {
                users.push(user);
            });
        });

        socket.emit('user-list', users);
    });


    // disconnect the user, and broadcast he or she has left
    socket.on('disconnect', function() {
        socket.get('user', function(error, user) {
            socket.broadcast.emit('left', user);
        });
    });

    // 
    socket.on('start-game', function() {

        // TODO HAZMAT CALL HERE
        var game = new Game(socketServer);
        game.start();
    });

}

// set up the socket responses
socketServer.sockets.on('connection', function (socket) {

    // listen for a user to join the room
    // store the user, then bind the socket to the other events that
    // the user can use once he/she has connected
    socket.on('join', function(data) {
        var user = {
            id: socket.id,
            name: data.name
        };

        socket.set('user', user, function() {
            socket.emit('ready');
            socket.broadcast.emit('joined', user);
            onUserJoined(socket);
        });
    });

});

