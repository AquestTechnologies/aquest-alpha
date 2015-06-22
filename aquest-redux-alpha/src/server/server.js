import fs     from 'fs';
import Hapi   from 'hapi';
import React  from 'react';
import Router from 'react-router';
import routes from '../shared/routes.jsx';
//import Flux from '../shared/flux.js';
//import FluxComponent from 'flummox/component';
import phidippides from '../shared/middlewares/phidippides.js';
import log from '../shared/utils/logTailor.js';

let server = new Hapi.Server();
process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // Ca sert à quoi ça ?

// Distribution des ports pour l'API et les websockets
const portApi = process.env.PORT || 8080;
const portWs = Number(portApi) + 1;
server.connection({ port: portApi, labels: ['api'] });
server.connection({ port: portWs, labels: ['ws'] });

//lance webpack-dev-server si on est pas en production
if (process.env.NODE_ENV !== 'production') {
 
  //lancement du webpack-dev-server
  let serverBundler = require('./dev_server.js'); 
  serverBundler();

  /*
  app.all('/build/*', function (req, res) {
    proxy.web(req, res, {
        target: 'http://localhost:8080'
    });
  });
  */

}

// Registration du plugin websocket
server.register([
  {register: require('./plugins/websocket')},
  {register: require('./plugins/api')}
], function (err) {
  
  if (err) throw err;
  server.start(function() {
    log('info', 'Make it rain! API server started at ' + server.info.uri);
    log('info', '              ws  server started at ' + server.select('ws').info.uri);
    console.log('  ___                        _        \n' + // !
                ' / _ \\                      | |      \n' +
                '/ /_\\ \\ __ _ _   _  ___  ___| |_    \n' +
                "|  _  |/ _` | | | |/ _ \\/ __| __|    \n" +
                '| | | | (_| | |_| |  __/\\__ \\ |_    \n' +
                '\\_| |_/\\__, |\\__,_|\\___||___/\\__|\n' +
                '          | |\n' +
                '          |_|'
               );
  
  });
});

//Routage des assets, inutile en production car derriere un CDN
/*server.route({
  method: 'GET',
  path: '/app.js',
  handler: function (request, reply) {
    reply.file('dist/app.js');
  }
});*/

/*server.route({
  method: 'GET',
  path: '/app.css',
  handler: function (request, reply) {
    reply.file('dist/app.css');
  }
});
*/
server.route({
    method: 'GET',
    path: '/img/{filename}',
    handler: function (request, reply) {
        reply.file('dist/img/' + request.params.filename);
    }
});

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply.file('index.html');
    //reply.prerenderer(request.url, request.info.remoteAddress, request.info.remotePort, request.method);
  }
});

server.route({
  method: 'GET',
  path: '/{p*}',
  handler: function (request, reply) {
    reply.file('index.html');
    //reply.prerenderer(request.url, request.info.remoteAddress, request.info.remotePort, request.method);
  }
});

server.route({
  method: 'GET',
  path: '/favicon.ico',
  handler: function (request, reply) {
    return reply({}); // Haha je kif
  }
});

// Prerendering
(function() {
  let c = 0;
  
  server.decorate('reply', 'prerenderer', function (url, ip, port, method) {
    
    // Intercepte la réponse
    let response = this.response().hold();
    
    // Affiche les infos de la requete
    let d = new Date(),
        h = d.getHours() + 2, //heure française / GTM
        m = d.getMinutes(),
        s = d.getSeconds();
    h = ('' + h).length == 2 ? h : '0' + h;
    m = ('' + m).length == 2 ? m : '0' + m;
    s = ('' + s).length == 2 ? s : '0' + s;
    c++;
    log('info', '\n[' + c + '] ' + h + ':' + m + ':' + s + ' ' + this.request.info.remoteAddress + ':' + this.request.info.remotePort + ' ' + this.request.method + ' ' + this.request.url.path);
    
    // Servira à lire le fichier HTML
    function readFile (filename, enc) {
      return new Promise(function (ohyes, ohno){
        fs.readFile(filename, enc, function (err, res){
          if (err) ohno(err);
          else ohyes(res);
        });
      });
    }
    
    // transforme coco.com/truc/ en coco.com/truc
    let correctUrl = url.path.slice(-1) === '/' && url.path !== '/' ? url.path.slice(0, -1) : url.path;
    // Initialise le router
    const router = Router.create({
      routes: routes,
      location: correctUrl
    });
    
    // Match la location et les routes, et renvoie le bon layout (Handler) et le state
    router.run( (Handler, routerState) => {
      log('info', '_____________ router.run _____________');
      // Pour l'application naissante c'est son premier router.run
      routerState.c = 1;
      // Initialise une nouvelle instance flux
      const flux = new Flux();
      
      // Initialise les stores
      log('info', '... Entering phidippides');
      phidippides(routerState, flux).then(function() {
        log('info', '... Exiting phidippides');
        // log('info', Handler);
        // log('info', 'state_________________________________________________');
        // log('info', state);
        // log('info', 'flux_________________________________________________');
        // log('info', flux);
        // log('info', '_________________________________________________');
        // log('info', flux._stores.universeStore.state);
        
        // On extrait le state de l'instance flux
        let fluxState = {};
        for (let store in flux._stores) { 
          fluxState[store] = flux._stores[store].state;
        }
        let serializedState = JSON.stringify(fluxState);
        // On escape le charactere ' du state serialisé
        serializedState = serializedState.replace(/'/g, '&apos;');
        log('info', '... Flux state serialized');
        // log('info', serializedState);
        
        // rendering de l'app fluxée
        // Doc React pour info : If you call React.render() on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
        log('info', '... Entering React.renderToString');
        try {
          var mount_me_im_famous = React.renderToString(
            <FluxComponent flux={flux}>
              <Handler {...routerState} />
            </FluxComponent>
          );
        } catch(err) {
          log('error', '!!! Error while React.renderToString.');
          log('error', err);
        }
        log('info', '... Exiting React.renderToString');
        
        // Le fichier html est partagé, penser a prendre une version minifée en cache en prod
        readFile('src/shared/index.html', 'utf8').then(function (html){
          
          // On extrait le contenu du mountNode 
          // Il est ici imperatif que le mountNode contienne du texte unique et pas de </div>
          let placeholder = html.split('<div id="mountNode">')[1].split('</div>')[0];
          // Enfin on cale notre élément dans le mountNode.
          let htmlWithoutFlux = html.replace(placeholder, mount_me_im_famous);
          let htmlWithFlux = htmlWithoutFlux.replace('id="mountNode"', 'id="mountNode" state-from-server=\'' + serializedState + '\'');
          response.source  = htmlWithFlux;
          response.send();
          log('info', 'Served '+ correctUrl + '\n');
        }).catch(function (err) {
          log('error', '!!! Error while reading HTML.');
          log('error', err);
        });
      }).catch(function(err) {
        log('error', '!!! Error while Phidippides.');
        log('error', err);
      });
    });
  });
})();
