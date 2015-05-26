import Hapi from 'hapi';
import Path from 'path'; //This module contains utilities for handling and transforming file paths. 

let port = process.env.PORT || 8080;
let server = new Hapi.Server();

server.connection({
  port: port
});

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply.file('dist/index.html');
  }
});

server.route({
    method: 'GET',
    path: '/{filename}',
    handler: function (request, reply) {
        reply.file('dist/' + request.params.filename);
    }
});

server.route({
    method: 'GET',
    path: '/img/{filename}',
    handler: function (request, reply) {
        reply.file('dist/img/' + request.params.filename);
    }
});

server.start(function() {
  console.log('Make it rain! Server started at %s', server.info.uri);
});