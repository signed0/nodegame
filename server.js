
var express = require('express'),
    io = require('socket.io'),
    path = require('path'),
    httpServer = express.createServer(),
    config = {},
    socketServer,
    teamASizes = {
        5: 3
        6: 4,
        7: 4,
        8: 5,
        9: 6,
        10: 6
    };

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

function assignTeams(clients) {
    var teamA = [],
        teamB = [],
        i = teamASizes[clients.length],
        j;

    while(i > 0) {
        j = Math.floor(Math.random() * (i+1));
        teamA.push(clients.splice(i, 1));
        i--;
    }

    Array.push.apply(teamB, clients);

    return [teamA, teamB];




}

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
        var teams, teamA, teamB;

        serverSocket.sockets.emit('game-started');

        teams = assignTeams(serverSocket.sockets.clients());
        teamA = teams[0];
        teamB = teams[1];

        // TODO HAZMAT CALL HERE
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

