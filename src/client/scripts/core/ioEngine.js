var socket = io(),

gIOEngine = {
    
    readyState: 0,
    
    init: function gIOinit() {
        socket.emit('msg', 'gIOEngine.init');
    }
};