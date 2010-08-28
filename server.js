var http   = require('http'),
    ws     = require('./lib/webserver'),
    io     = require('./lib/socket.io'),
    sys    = require('sys'),
    config = require('./config');

var web = http.createServer(ws)
var socket = io.listen(web);

web.listen(config.webport);

socket.on('connection', function(client) {
    sys.debug('client connected');
    client.send('welcome!');

    client.on('message', function(data) {
        sys.debug('MSG: ' + data);
    });
});
