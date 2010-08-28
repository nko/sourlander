var sys  = require('sys'), 
    Pool = require('./GamePool'),
    Game = require('./Game');
var GameClient = module.exports = function(client) {

    this.game = null;
    this.client = client;

    function onMessage(data) {
        sys.debug('MSG: ' + data);
        if(typeof(data) !== 'object') {
            var data = JSON.parse(data);
        }
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

                case 'chat':
                    if(this.game != null){
                        this.game.chatMessage(data.data);
                    }
                    break;
            }
        }
    }

    function onClose() {
        sys.debug('client quit');
        if(this.game != null) {
            this.game.leave(this);
            this.game = null
        }
    }
    
    client.on('message', onMessage);
    client.on('disconnect', onClose);

    sys.debug('client connected');
}

GameClient.prototype.send = function(data) {
    this.client.send(data);
}
