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
                    $('#chat_log').prepend('&gt;&gt; ' + data.data.nick + ': ' + data.data.text + '<br />');
                    break;
            }
        }
    }

    function refreshMap(data) {
        if(data.dataType === 'seed') {
            this.map = new Map('map', data.data);
        }
        $('#map').show();
    }

    function onConnect() {
        $('.status').text('connected');
        $('#chat_input').bind('keyup', function(ev) {
            if(ev.keyCode === 13) {
                var line = $('#chat_input').val();
                socket.send(JSON.stringify({type: 'chat', data: {nick: gc.nickname, text: line}}));
                $('#chat_input').val('');
            }
        });
        $('#chat').show();

    }

    var socket = new io.Socket(null, {transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'flashsocket']}); // @BUGFIX: flashsocket seems to be broken

    function joinGame() {
        //window.location.hash = gc.hash;
        socket.connect();
        socket.on('message', onMessage);
        socket.on('connect', onConnect);
        socket.send(JSON.stringify({'type': 'gameid', 'data': hash}));
    }

    function setGameHash(newHash) {
        gc.hash = newHash;
        $('.hash').text(newHash);
    }   

    function setNickname(newNick) {
        store.set('tw_nick', newNick); 
        gc.nickname = newNick; 
        $('.nick').text(newNick);
    }

    if(window.location.hash != '') {
        var hash = window.location.hash;
    } else {
        var hash = '#' + parseInt(Math.random() * 100000000).toString(16);
    }
    setGameHash(hash);

    if(store.get('tw_nick') === undefined) {
        changeNickname();
    } else {
        setNickname(store.get('tw_nick'));
    }

    $('#change_nick').live('click', changeNickname);
    $('#change_game_hash').live('click', changeGameHash);
    $('#join_game').live('click', joinGame);

    function changeNickname() {
        $('body').append('<div class="dialog" id="setnick_dialog"><label for="nick">Nichname:</label><input type="text" id="nick" name="nick" /><br /><input type="button" id="setnick" value="okay" /></div>');
        $('#setnick').click(function() {
            setNickname($('#nick').val());
            $('#setnick_dialog').remove();
        });
    }

    function changeGameHash() {
        $('body').append('<div class="dialog" id="sethash_dialog"><label for="hash">Gamename:</label><input type="text" id="hash" name="hash" /><br /><input type="button" id="sethash" value="okay" /></div>');
        $('#sethash').click(function() {
            setGameHash('#' + $('#hash').val());   
            $('#sethash_dialog').remove();
        }); 
    }
}
