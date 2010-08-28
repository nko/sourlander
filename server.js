var http   = require('http'),
    ws     = require('./webserver'),
    config = require('./config');

var web = http.createServer(ws).listen(config.webport);
