var Hapi = require('hapi');

var server = new Hapi.Server();
var portApi = 8080;
var portWs = 8081;
server.connection({ port: portApi, labels: ['api'] });
server.connection({ port: portWs, labels: ['ws'] });

// Registration du plugin websocket
server.register(require('./websocket'), function (err) {
  if (err) { throw err; }
  // Si le server websocket est bien démarré, on lance le serveur API
  server.start(function() {
    console.log('Make it rain! API server started at ' + server.info.uri);
    console.log('              ws  server started at ' + server.select('ws').info.uri);
  });
});

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply.file('./index.html');
  }
});

server.route({
    method: 'GET',
    path: '/{filename}',
    handler: function (request, reply) {
        reply.file('./bundle/' + request.params.filename);
    }
});

server.route({
    method: 'GET',
    path: '/img/{filename}',
    handler: function (request, reply) {
        reply.file('./img/' + request.params.filename);
    }
});
