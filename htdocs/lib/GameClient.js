var GameClient = function() {

    function onMessage(data) {
        $('#log').append('MSG: ' + data + '<br />');
        var data = JSON.parse(data);
        if(data.type) {
            switch(data.type) {
                case 'map':
                    refreshMap(data);
                    break;
                case 'player_joined':
                    $('#log').append('new player!<br />');
            }
        }
    }

    function refreshMap(data) {
        if(data.dataType === 'seed') {
            this.map = new Map('map', data.data);
        }
    }

    function onConnect() {
        $('#log').append('CONNECTED<br />');
    }

    var socket = new io.Socket(null, {transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'flashsocket']}); // @BUGFIX: flashsocket seems to be broken
    socket.connect();
    socket.on('message', onMessage);
    socket.on('connect', onConnect);
    if(window.location.hash != '') {
        var hash = window.location.hash;
    } else {
        $('#log').append('random hash...');
        var hash = '#' + parseInt(Math.random() * 100000000).toString(16);
        $('#log').append(hash);
        window.location.hash = hash;
    }
    socket.send(JSON.stringify({'type': 'gameid', 'data': hash}));
}
