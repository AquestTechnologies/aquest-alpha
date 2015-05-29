import fs     from 'fs';
import Hapi   from 'hapi';
import React  from 'react';
import Router from 'react-router';
import routes from '../shared/routes.jsx';
import Flux from '../shared/flux.js';
import FluxComponent from 'flummox/component';
import performRouteHandlerStaticMethod from '../shared/utils/performRouteHandlerStaticMethod.js';

let port = process.env.PORT || 8080;
let server = new Hapi.Server();

server.connection({
  port: port
});

server.start(function() {
  console.log('Make it rain! Server started at %s', server.info.uri);
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
  //on intercepte la réponse
  console.log("Starting prerendering.");
  let response = this.response().hold();
  
  function readFile (filename, enc) {
    return new Promise(function (ohyes, ohno){
      fs.readFile(filename, enc, function (err, res){
        if (err) ohno(err);
        else ohyes(res);
      });
    });
  }
  
  const flux = new Flux();
  
  //les routes sont partagées et react router prend le relai pour /*
  Router.run(routes, this.request.url.path, async (Handler, state) => {
    const routeHandlerInfo = { state, flux };
    await performRouteHandlerStaticMethod(state.routes, 'routerWillRun', routeHandlerInfo);
  
    //sérialisation de l'app
    let mount_me_im_famous = React.renderToString(
      <FluxComponent flux={flux}>
        <Handler {...state} />
      </FluxComponent>,
      document.getElementById('mountNode')
    );
    
    
    //le fichier html est partagé
    //penser a le mettre en cache en prod et a prendre une version minifée
    readFile('src/shared/index.html', 'utf8').then(function (html){
      //si le fichier html est chargé on extrait le contenu du mountNode
      let placeholder = html.split('<div id="mountNode">')[1].split('</div>')[0];
      //puis on cale notre élément dans le mount node.
      response.source = html.split(placeholder)[0] + mount_me_im_famous + html.split(placeholder)[1];
      response.send();
    });
    
  });
  return true;//inutile?
});
