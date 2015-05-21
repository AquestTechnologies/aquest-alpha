var Hapi = require('hapi');
var Path = require('path'); //This module contains utilities for handling and transforming file paths. 

var port = process.env.PORT || 8080;
var server = new Hapi.Server();

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
  console.log('Make it rain! %s', server.info.uri);
});