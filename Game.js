var utils = require('./utils.js'),
    forEach = utils.forEach;

function Game(io, goods, bads){

    this.io = io;
    this.goods = goods;
    this.bads = bads;
    this.round = 0;
    this.rooms = {};

    forEach(this.bads, function (socket) {
        socket.join('spies');
    }); 

}

Game.prototype = {

    start: function () {
        this.io.sockets.in('spies').emit('log', 'you are a spy!'); 
    },

};

exports.Game = Game;
