var http    = require('http'),
    ws      = require('./lib/webserver'),
    io      = require('./lib/socket.io'),
    GClient = require('./lib/GameClient'),
    sys     = require('sys'),
    config  = require('./config');

var web = http.createServer(ws)
var socket = io.listen(web);

web.listen(config.webport);

socket.on('connection', function(client) {
    var gc = new GClient(client);
});
