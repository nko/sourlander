var Map  = require('./Map'), 
    Pool = require('./GamePool');

var Game = module.exports = function Game(host, key) {
    this.host = host;
    this.player = null;
    this.key = key;
    console.log('creating game ' + this.key);

    function generateMapSeed() {
        function round(num) {
            return Math.round(num * 10000) / 10000;
        }
        var r0 = round(Math.random() * 180, 4);
        var r1 = round(Math.random() * 6 + 9, 4);
        var r2 = round(Math.random() * 30+30, 4);
        return [r0, r1, r2];
    }

    var seed = generateMapSeed();
    this.map = new Map(seed);

    host.send(this.map.toString());
}
    
Game.prototype.chatMessage = function(msg) {
    if(this.player !== null) {
        this.player.send({type: 'chat', data: msg});
    }
    if(this.host !== null) {
        this.host.send({type: 'chat', data: msg});
    }
}

Game.prototype.join = function(client) {
    if(this.player === null) {
        this.player = client;
        this.player.send(this.map.toString());
        this.host.send({type: 'player_joined'});
        return true;
    }
    return false;
}

Game.prototype.leave = function(client) {
    if(this.host === client) {
        // close the game
        this.host = null;
        if(this.player !== null) {
            this.player.send('{"type": "host_left"}');
            this.player = null;
        }
        console.log('removing game ' + this.key);
        Pool.remove(this.key);
    }
    if(this.player === client) {
        this.player = null;
        this.host.send('{"type": "player_left"}');
    }
}
