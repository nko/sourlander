function debug(data) {
    if(window.console && window.console.log) {
        console.log(data);
    } else {
        if(typeof(data) == 'object') {
            data = JSON.stringify(data);
        }
        $('#log').append('<i>LOG: ' + data + '</i><br />'); 
    }
}

function log(data) {
    $('#log').append(data + '<br />'); 
}

var GameClient = function() {
    
    var gc = this;

    function onMessage(data) {
        debug(data);
        if(typeof(data) === 'string') {
            var data = JSON.parse(data);
        }
        if(data.type) {
            switch(data.type) {
                case 'map':
                    refreshMap(data);
                    break;

                case 'player_joined':
                    log('new player!');
                    break;

                case 'player_left':
                    log('player left!');
                    break;

                case 'host_left':
                    log('host left, the game is closed!');
                    log('please refresh to restart the game');
                    break;

                case 'chat':
                    log('&gt;&gt; ' + data.data);
                    break;
            }
        }
    }

    function refreshMap(data) {
        if(data.dataType === 'seed') {
            this.map = new Map('map', data.data);
        }
    }

    function onConnect() {
        $('#chat').bind('keyup', function(ev) {
            if(ev.keyCode === 13) {
                var line = $('#chat').val();
                socket.send(JSON.stringify({type: 'chat', data: line}));
                $('#chat').val('');
            }
        });

    }

    var socket = new io.Socket(null, {transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'flashsocket']}); // @BUGFIX: flashsocket seems to be broken

    function joinGame() {
        socket.connect();
        socket.on('message', onMessage);
        socket.on('connect', onConnect);
        if(window.location.hash != '') {
            var hash = window.location.hash;
        } else {
            var hash = '#' + parseInt(Math.random() * 100000000).toString(16);
            window.location.hash = hash;
        }
        socket.send(JSON.stringify({'type': 'gameid', 'data': hash}));
    }

    if(store.get('tw_nick') === undefined) {
        changeNickname();
    } else {
        this.nickname = store.get('tw_nick');
        $('span.nick').text(this.nickname);
    }
    $('#change_nick').live('click', changeNickname);




    
    function changeNickname() {
        $('body').append('<div class="dialog" id="setnick_dialog"><label for="nick">Nichname:</label><input type="text" id="nick" name="nick" /><br /><input type="button" id="setnick" value="okay" /></div>');
        $('#setnick').click(function() {
            console.log($('#nick').val());
            store.set('tw_nick', $('#nick').val());
            gc.nickname = store.get('tw_nick');
            $('span.nick').text(gc.nickname);
            $('#setnick_dialog').remove();
        });
    }
}
