var sys = require('sys');
var GameClient = module.exports = function(client) {

    function onMessage(data) {
        sys.debug('MSG: ' + data);

    }

    function onClose() {
        sys.debug('client quit');
    }
    
    client.on('message', onMessage);
    client.on('disconnect', onClose);

    sys.debug('client connected');
    client.send('welcome!');
}
