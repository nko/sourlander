var sys  = require('sys'), 
    Pool = require('./GamePool'),
    Game = require('./Game');
var GameClient = module.exports = function(client) {

    function onMessage(inc) {
        sys.debug('MSG: ' + inc);
        var data = JSON.parse(inc);
        if(data.type) {
            switch(data.type) {
                case 'gameid':
                    if(Pool.exists(data.data)) {
                        var game = Pool.get(data.data);
                        if(game.join(this)) {
                            this.game = game;
                        } else {
                            client.send('game full, sry');
                        }
                    } else {
                        this.game = new Game(this, data.data)
                        Pool.store(data.data, this.game);
                    }
                    break;
            }
        }
    }

    function onClose() {
        sys.debug('client quit');
        if(this.game != undefined) {
            this.game.leave(this);
        }
    }

    this.client = client;
    
    client.on('message', onMessage);
    client.on('disconnect', onClose);

    sys.debug('client connected');
}

GameClient.prototype.send = function(data) {
    this.client.send(data);
}
