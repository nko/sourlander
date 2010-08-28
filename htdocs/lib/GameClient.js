var GameClient = function() {

    function onMessage(data) {
        $('#log').append('MSG: ' + data + '<br />');
    }

    function onConnect() {
        $('#log').append('CONNECTED<br />');
    }

    var socket = new io.Socket();
    socket.connect();
    socket.on('message', onMessage);
    socket.on('connect', onConnect);
}
