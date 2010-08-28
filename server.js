var http   = require('http'),
    ws     = require('./webserver'),
    io     = require('./lib/socket.io'),
    config = require('./config');

var web = http.createServer(ws).listen(config.webport);
var socket = io.listen(web);

socket.on('connection', function(client) {
    
});
