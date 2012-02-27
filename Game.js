var utils = require('./utils.js'),
    forEach = utils.forEach,
    teamASizes = {
        5: 3,
        6: 4,
        7: 4,
        8: 5,
        9: 6,
        10: 6
    };

function Game(io) {

    this.io = io;
    this.players = io.sockets.clients();
    this.leaderIndex = 0;
    this.round = 0;

    var teams = assignTeams(this.players);
    this.goods = teams[0];
    this.bads = teams[1];

    forEach(this.bads, function (socket) {
        socket.join('bads');
    }); 

}

Game.prototype = {

    start: function () {
        this.io.sockets.emit('log', 'game started'); 
        this.io.sockets.in('bads').emit('log', 'you are a bad guy!'); 
    },

};

module.exports = Game;

function assignTeams(clients) {
    var teamA = [],
        teamB = [],
        i = teamASizes[clients.length],
        j;

    while (i > 0) {
        j = Math.floor(Math.random() * (i+1));
        teamA.push(clients.splice(j, 1));
        i--;
    }

    teamB = [].concat(clients);

    return [teamA, teamB];
}
