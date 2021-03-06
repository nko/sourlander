var config = require('../config'),
    mime   = require('./mime'),
    url    = require('url'),
    fs     = require('fs'),
    sys    = require('sys'), 
    path   = require('path');

function sendFile(path, response) {
    var type = mime.lookup(path);
    fs.readFile(path, 'binary', function(err, data) {
        if(err) {
            // @TODO: error handling
            console.log(err);
            response.writeHead(404);
            response.end();
            return; 
        }
        response.writeHead(200, {'Content-Type': type , 'Cache-Control': 'max-age=600'});
        response.write(data, 'binary');
        response.end();
    });
}

var webserver = module.exports = function(request, response) {
    sys.puts('request: ' + request.url);
    var query = url.parse(request.url); // parse the requestet path. 
    if(query.pathname === '/') {
        query.pathname = '/index.html';
    }
    var file  = config.documentRoot + query.pathname;

    path.exists(file, function(fileExists) {
        if(true === fileExists) {
            sendFile(file, response);
        } else {
            response.writeHead(404);
            response.end();
        }
    });
}
