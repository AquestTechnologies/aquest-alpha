var Handlers = require('./handlers');
var SocketIo = require('socket.io');
var Caman = require('caman').Caman;

// Le plugin Websocket pour Hapi
exports.register = function (server, options, next) {
    
    // On cree un nouveau server websocket derriere le port attribué
    var io = new SocketIo(server.select('ws').listener);
    var c = 0;
    io.on('connection', function (socket) {
        c++;
        console.log('___ [' + c + '] New client connected');
        socket.emit('message', 'hi');
        
        
        
    });

    next();
};

exports.register.attributes = {
    name: 'hapi-ws'
};