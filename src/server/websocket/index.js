var Handlers = require('./handlers');
var Socketio = require('socket.io');

exports.register = function (server, options, next) {
    
    var io = new Socketio(server.select('ws').listener);

    io.on('connection', function (socket) {

        console.log('New connection!');

        socket.on('hello', Handlers.hello);
        socket.on('newMessage', Handlers.newMessage);
        socket.on('goodbye', Handlers.goodbye);
    });

    next();
};

exports.register.attributes = {
    name: 'hapi-ws'
};