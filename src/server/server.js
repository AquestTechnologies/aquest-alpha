import fs     from 'fs';
import Hapi   from 'hapi';
import React  from 'react';
import Router from 'react-router';
import routes from '../shared/routes.jsx';

import { createRedux, createDispatcher, composeStores } from 'redux';
import promiseMiddleware from '../shared/middlewares/promiseMiddleware.js';
import * as reducers from '../shared/reducers';
import { Provider } from 'redux/react';

import phidippides from '../shared/middlewares/phidippides.js';
import log from '../shared/utils/logTailor.js';

let server = new Hapi.Server();
process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // Ca sert à quoi ça ? --> ça permettra de ne plus passer par le webpack-dev-server pour les fichiers statics en production

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
}

// Registration du plugin websocket
server.register([
  {register: require('./plugins/websocket')},
  {register: require('./plugins/api')}
], function (err) {
  
  if (err) throw err;
  server.start(function() {
    log('Make it rain! API server started at ' + server.info.uri);
    log('              ws  server started at ' + server.select('ws').info.uri);
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

// Config des cookies
/*server.state('STATE_FROM_SERVER', {
    ttl: null,
    encoding: 'base64json'
});*/
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
    reply.prerenderer(request.url, request.info.remoteAddress, request.info.remotePort, request.method);
  }
});

server.route({
  method: 'GET',
  path: '/{p*}',
  handler: function (request, reply) {
    reply.prerenderer(request.url, request.info.remoteAddress, request.info.remotePort, request.method);
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
    log('\n[' + c + '] ' + h + ':' + m + ':' + s + ' ' + this.request.info.remoteAddress + ':' + this.request.info.remotePort + ' ' + this.request.method + ' ' + this.request.url.path);
    
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
      log('_____________ router.run _____________');
      // Pour l'application naissante c'est son premier router.run
      routerState.c = 1;
      // Initialise une nouvelle instance flux
      //const flux = new Flux();
      const dispatcher = createDispatcher(
        composeStores(reducers),
        [promiseMiddleware]
      );
      
      const store = createRedux(dispatcher);
      
      // Initialise les stores
      log('... Entering phidippides');
      phidippides(routerState, store.getState(), store.dispatch).then(function() {
        log('... Exiting phidippides');
        
        // On extrait le state du store
        //let serializedState = JSON.stringify(store.getState()).replace(/</g, '&lsaquo;');
        // let serializedState = store.getState();
        log('... State serialized');
        // log(serializedState);
        
        // rendering de l'app fluxée
        // Doc React pour info : If you call React.render() on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
        log('... Entering React.renderToString');
        try {
          var mount_me_im_famous = React.renderToString(
            <Provider redux={store}>
              {() =>
                <Handler {...routerState} />
              }
            </Provider>
          );
        } catch(err) {
          log('error', '!!! Error while React.renderToString');
          log('error', err);
        }
        log('... Exiting React.renderToString');
        
        // Le fichier html est partagé, penser a prendre une version minifée en cache en prod
        readFile('index.html', 'utf8').then(function (html){
          
          // On extrait le contenu du mountNode 
          // Il est ici imperatif que le mountNode contienne du texte unique et pas de </div>
          //let placeholder = html.split('<div id="mountNode">')[1].split('</div>')[0];
          // Enfin on cale notre élément dans le mountNode.
          //let htmlWithoutState = html.replace(placeholder, mount_me_im_famous);
          //let htmlWithState = htmlWithoutState.replace('id="mountNode"', 'id="mountNode" state-from-server=\'' + serializedState + '\'');
          let placeholder = html.split('<div id="mountNode">')[1].split('</div>')[0];
          html = html.replace(placeholder, mount_me_im_famous);
          //log('store state : ' + JSON.stringify(store.getState()));
          html = html.replace('</title>','</title>\n\t<script>window.STATE_FROM_SERVER='+JSON.stringify(store.getState())+';</script>');
          //response.state('STATE_FROM_SERVER', JSON.stringify(store.getState()));
          response.source = html;
          response.send();
          log('Served '+ correctUrl + '\n');
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
