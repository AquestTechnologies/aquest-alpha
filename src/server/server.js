import fs         from 'fs';
import Hapi       from 'hapi';
import React      from 'react';
import Router     from 'react-router';

import { createRedux, createDispatcher, composeStores } from 'redux';
import { Provider }                                     from 'redux/react';

import * as reducers      from '../shared/reducers';
import routes             from '../shared/routes.jsx';
import log                from '../shared/utils/logTailor.js';
import devConfig          from '../../config/development.js';
import phidippides        from '../shared/utils/phidippides.js';
import promiseMiddleware  from '../shared/utils/promiseMiddleware.js';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
log('node', 'Starting Node in ' + process.env.NODE_ENV + ' mode');

const config = devConfig();
let server = new Hapi.Server();

// Distribution des ports pour l'API et les websockets
server.connection({ port: config.api.port, labels: ['api'] });
server.connection({ port: config.ws.port,  labels: ['ws']  });

//lance webpack-dev-server si on est pas en production
if (process.env.NODE_ENV === 'development') {
  let serverBundler = require('./dev_server.js'); 
  serverBundler();
}

// Registration du plugin websocket
server.register([
  {register: require('./plugins/websocket')},
  {register: require('./plugins/api')}
], 
function (err) {
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
    reply.prerenderer();
  }
});

server.route({
  method: 'GET',
  path: '/{p*}',
  handler: function (request, reply) {
    reply.prerenderer();
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
  
  server.decorate('reply', 'prerenderer', function () {
    
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
    let url = this.request.url.path;
    let correctUrl = url.slice(-1) === '/' && url !== '/' ? url.slice(0, -1) : url;
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
      let d = new Date();
      phidippides(routerState, store.getState(), store.dispatch).then(function() {
        log('info', '... Exiting phidippides after ' + (new Date() - d) + 'ms' , '... Entering React.renderToString');
        
        try {
          var mount_me_im_famous = React.renderToString(
            <Provider redux={store}>
              {() =>
                <Handler {...routerState} />
              }
            </Provider>
          );
        } 
        catch(err) {
          log('error', '!!! Error while React.renderToString', err);
        }
        log('... Exiting React.renderToString');
        
        // Le fichier html est partagé, penser a prendre une version minifée en cache en prod
        readFile('index.html', 'utf8').then(function (html){
          
          // On extrait le contenu du mountNode 
          // Il est ici imperatif que le mountNode contienne du texte unique et pas de </div>
          let placeholder = html.split('<div id="mountNode">')[1].split('</div>')[0];
          // Enfin on cale notre élément dans le mountNode.
          html = html.replace(placeholder, mount_me_im_famous);
          // html = html.replace('</title>','</title>\n\t<script>window.STATE_FROM_SERVER='+JSON.stringify(store.getState())+';</script>');
          html = html.replace('</body>',
            '\t<script>window.STATE_FROM_SERVER='+JSON.stringify(store.getState())+';</script>\n' +
            '\t<script src="' + config.wds.hotFile + '"></script>\n' +
            '\t<script src="' + config.wds.publicPath + '/' + config.wds.filename + '"></script>\n' +
            '</body>'
          );
          response.source = html;
          response.send();
          log('Served '+ correctUrl + '\n');
        }).catch(function (err) {
          log('error', '!!! Error while reading HTML.', err);
        });
      }).catch(function(err) {
        log('error', '!!! Error while Phidippides.', err);
      });
    });
  });
})();
