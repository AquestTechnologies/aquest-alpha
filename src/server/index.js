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
  console.log('  ___                        _   \n' + // B)
              ' / _ \\                      | |  \n' +
              '/ /_\\ \\ __ _ _   _  ___  ___| |_ \n' +
              "|  _  |/ _` | | | |/ _ \\/ __| __|\n" +
              '| | | | (_| | |_| |  __/\\__ \\ |_ \n' +
              '\\_| |_/\\__, |\\__,_|\\___||___/\\__|\n' +
              '          | |\n' +
              '          |_|'
             );

});

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply.prerenderer(request.url);
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
      reply.prerenderer(request.url, request.info.remoteAddress, request.info.remotePort, request.method);
    }
});

//Prerendering
(function() {
  let c = 0;
  
  server.decorate('reply', 'prerenderer', function (url, ip, port, method) {
    
    //Intercepte la réponse
    let response = this.response().hold();
    
    //Affiche les infos de la requete
    let d = new Date(),
        h = d.getHours() + 2, //heure française / GTM
        m = d.getMinutes(),
        s = d.getSeconds();
    h = ('' + h).length == 2 ? h : '0' + h;
    m = ('' + m).length == 2 ? m : '0' + m;
    s = ('' + s).length == 2 ? s : '0' + s;
    c++;
    console.log('\n[' + c + '] ' + h + ':' + m + ':' + s + ' ' + this.request.info.remoteAddress + ':' + this.request.info.remotePort + ' ' + this.request.method + ' ' + this.request.url.path);

    function readFile (filename, enc) {
      return new Promise(function (ohyes, ohno){
        fs.readFile(filename, enc, function (err, res){
          if (err) ohno(err);
          else ohyes(res);
        });
      });
    }

    //Initialize le router
    const router = Router.create({
      routes: routes,
      location: url.path
    });
    
    //Match la location et les routes, et renvoie le bon layout (Handler) et le state
    router.run(async (Handler, state) => {
      
      //On initialise une nouvelle instance flux
      const flux = new Flux();
      const routeHandlerInfo = { state, flux };
      
      //On initialise les stores
      // await performRouteHandlerStaticMethod(state.routes, 'routerWillRun', routeHandlerInfo);
      await performRouteHandlerStaticMethod(state.routes, 'routerWillRun', routeHandlerInfo);
      console.log('... performRouteHandlerStaticMethod done');
      // console.log(Handler);
      // console.log('state_________________________________________________');
      // console.log(state);
      // console.log('flux_________________________________________________');
      // console.log(flux);
      
      //sérialisation de l'app fluxée
      //Doc React pour info : If you call React.render() on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
      let mount_me_im_famous = React.renderToString(
        <FluxComponent flux={flux}>
          <Handler {...state} />
        </FluxComponent>
      );
      console.log('... React.renderToString done');
      
      //le fichier html est partagé, penser a prendre une version minifée en cache en prod
      readFile('src/shared/index.html', 'utf8').then(function (html){
        
        //on extrait le contenu du mountNode 
        let placeholder = html.split('<div id="mountNode">')[1].split('</div>')[0];
        
        //puis on cale notre élément dans le mountNode.
        response.source = html.split(placeholder)[0] + mount_me_im_famous + html.split(placeholder)[1];
        response.send();
        console.log('Served '+ url.path + '\n');
      });
      
    });
  });
})();
