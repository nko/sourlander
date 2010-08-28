var http   = require('http'),
    ws     = require('./webserver'),
    io     = require('./lib/socket.io'),
    config = require('./config');

var web = http.createServer(ws)
var socket = io.listen(web);

web.listen(config.webport);

socket.on('connection', function(client) {
    
});
