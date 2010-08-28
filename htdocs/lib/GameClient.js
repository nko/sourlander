var GameClient = function() {

    function onMessage(data) {
        $('#log').append('MSG: ' + data + '<br />');
    }

    function onConnect() {
        $('#log').append('CONNECTED<br />');
    }

    var socket = new io.Socket(null, {transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'flashsocket']}); // @BUGFIX: flashsocket seems to be broken
    socket.connect();
    socket.on('message', onMessage);
    socket.on('connect', onConnect);
}
