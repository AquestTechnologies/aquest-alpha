import fs from 'fs';
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
  console.log(this.request.getLog());
  console.log("Starting prerendering.");
  //on intercepte la réponse
  let response = this.response().hold();
  //les routes sont partagées et react router prend le relai pour /*
  Router.run(routes, this.request.url.path, function(Handler){
    //sérialisation de l'app
    let mount_me_im_famous = React.renderToString(React.createElement(Handler, elementprops));
    //le fichier html est partagé
    //penser a le mettre en cache en prod et a prendre une version minifée
    fs.readFile('src/shared/index.html', 'utf8', function read(err, data) {
        if (err || !data) {
          response.source = '500'; //correct?
          response.send();
          throw err;
        }
        //si le fichier html est chargé on extrait le contenu du mountNode
        let placeholder = data.split("<div id=\"mountNode\">")[1].split("</div>")[0];
        //puis on cale notre élément dans le mount node.
        response.source = data.split(placeholder)[0] + mount_me_im_famous + data.split(placeholder)[1];
        response.send();
        return; //utile?
    });
  });
  return true;//this.response({ status: 'ok' });
});

server.start(function() {
  console.log('Make it rain! Server started at %s', server.info.uri);
});