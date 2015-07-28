let Handlers = require('./handlers');
let SocketIo = require('socket.io');

// Le plugin Websocket pour Hapi
exports.register = function (server, options, next) {
    
    // On cree un nouveau server websocket derriere le port attribué
    const io = new SocketIo(server.select('ws').listener);
    let c = 0;
    io.on('connection', (socket) => {
        c++;
        console.log('___ [' + c + '] New client connected');
        
        // socket.emit('message', 'hi');
        
        // socket.on('hello', Handlers.hello);
        socket.on('createMessage', Handlers.createMessage);
        // socket.on('goodbye', Handlers.goodbye);
    });

    next();
};

exports.register.attributes = {
    name: 'hapi-ws'
};