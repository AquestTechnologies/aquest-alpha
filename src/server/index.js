import Hapi from 'hapi';
import React from 'react';
import Router from 'react-router';
import routes from '../shared/routes.jsx';

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
  path: '/app.js',
  handler: function (request, reply) {
    reply.file('dist/app.js');
  }
});

server.route({
  method: 'GET',
  path: '/app.css',
  handler: function (request, reply) {
    reply.file('dist/app.css');
  }
});

server.route({
    method: 'GET',
    path: '/img/{filename}',
    handler: function (request, reply) {
        reply.file('dist/img/' + request.params.filename);
    }
});

server.route({
    method: 'GET',
    path: '/{filename}',
    handler: function (request, reply) {
        reply.prerenderer();
    }
});

server.decorate('reply', 'prerenderer', function (elementprops) {
  var response = this.response().hold();
  Router.run(routes, this.request.url.path, function(Handler){
    var component = React.createElement(Handler, elementprops);
    var renderedToString = React.renderToString(component);
    response.source = '<html><head><meta charset="utf-8"><link rel="stylesheet" type="text/css" href="app.css"><title>Aquest</title></head><body>'+ renderedToString +'<script src="app.js"></script></body></html>';
    response.send();
  });
  
  return true;//this.response({ status: 'ok' });
});

server.start(function() {
  console.log('Make it rain! Server started at %s', server.info.uri);
});