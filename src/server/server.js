import fs         from 'fs';
import Hapi       from 'hapi';
import React      from 'react';
import Router     from 'react-router';
import Immutable  from 'immutable';

import { createStore, combineReducers, applyMiddleware  } from 'redux';
import { Provider }                     from 'react-redux';

import * as reducers      from '../shared/reducers';
import routes             from '../shared/routes.jsx';
import log                from '../shared/utils/logTailor.js';
import devConfig          from '../../config/development.js';
import phidippides        from '../shared/utils/phidippides.js';
import promiseMiddleware  from '../shared/utils/promiseMiddleware.js';

import {createActivists} from './lib/activityGenerator';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
log('node', `Starting Node in ${process.env.NODE_ENV} mode`);

const config = devConfig();
const server = new Hapi.Server();

// Distribution des ports pour l'API et les websockets
server.connection({ port: config.api.port, labels: ['api'] });
server.connection({ port: config.ws.port,  labels: ['ws']  });

//lance webpack-dev-server si on est pas en production
if (process.env.NODE_ENV === 'development') require('./dev_server.js')();

// Registration du plugin websocket
server.register([
  {register: require('./plugins/websocket')},
  {register: require('./plugins/api')}
], err => {
  if (err) throw err;
  
  server.start(() => {
    log(`Make it rain! API server started at ${server.info.uri}`);
    log(`              ws  server started at ${server.select('ws').info.uri}`);
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

server.route({
  method: 'GET',
  path: '/img/{filename}',
  handler: (request, reply) => reply.file('dist/img/' + request.params.filename)
});

server.route({
  method: 'GET',
  path: '/',
  handler: (request, reply) => reply.prerenderer(request, reply)
});

server.route({
  method: 'GET',
  path: '/{p*}',
  handler: (request, reply) => reply.prerenderer(request, reply)
});

server.route({
  method: 'GET',
  path: '/favicon.ico',
  handler: (request, reply) => reply({}) // Haha je kif
});

// Prerendering
(() => {
  let c = 0;
  server.decorate('reply', 'prerenderer', (request, reply) => {
    
    // Intercepte la réponse
    const response = reply.response().hold();
    
    // Affiche les infos de la requete
    let d = new Date(),
        h = d.getHours() + 2, //heure française / GTM
        m = d.getMinutes(),
        s = d.getSeconds();
    h = ('' + h).length == 2 ? h : '0' + h;
    m = ('' + m).length == 2 ? m : '0' + m;
    s = ('' + s).length == 2 ? s : '0' + s;
    c++;
    log(`\n[${c}] ${h}:${m}:${s} ${request.info.remoteAddress}:${request.info.remotePort} ${request.method} ${request.url.path}`);
    
    // Servira à lire le fichier HTML
    function readFile (filename, enc) {
      return new Promise((resolve, reject) => {
        fs.readFile(filename, enc, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
      });
    }
    
    // transforme coco.com/truc/ en coco.com/truc
    const url = request.url.path;
    const correctUrl = url.slice(-1) === '/' && url !== '/' ? url.slice(0, -1) : url;
    // Initialise le router
    const router = Router.create({
      routes: routes,
      location: correctUrl
    });
    
    // Match la location et les routes, et renvoie le bon layout (Handler) et le state
    router.run((Handler, routerState) => {
      log('_____________ router.run _____________');

      // Initialise une nouvelle instance flux  
      const store = applyMiddleware(promiseMiddleware)(createStore)(combineReducers(reducers), {});
      
      // Initialise les stores
      log('... Entering phidippides');
      const d = new Date();
      phidippides(routerState, store.dispatch).then(() => {
        
        log('info', `... Exiting phidippides after ${new Date() - d}ms` , '... Entering React.renderToString');
        
        try {
          var mountMeImFamous = React.renderToString(
            <Provider store={store}>
              {() => <Handler {...routerState} />}
            </Provider>
          );
        } 
        catch(err) {
          log('error', '!!! Error while React.renderToString', err);
        }
        
        log('... Exiting React.renderToString');
        
        // Le fichier html est partagé, penser a prendre une version minifée en cache en prod
        readFile('index.html', 'utf8').then(html => {
          
          // On extrait le contenu du mountNode 
          // Il est ici imperatif que le mountNode contienne du texte unique et pas de </div>
          let placeholder = html.split('<div id="mountNode">')[1].split('</div>')[0]; //à mod.
          
          // Enfin on cale notre élément dans le mountNode.
          html = html.replace(placeholder, mountMeImFamous);
          
          // Passage du state dans window
          let serverState = store.getState();
          serverState.immutableKeys = [];
          for (var key in serverState) {
            if (Immutable.Map.isMap(serverState[key])) serverState.immutableKeys.push(key); //Mutation !
          }
          html = html.replace('</body>',
            `\t<script>window.STATE_FROM_SERVER=${JSON.stringify(serverState)}</script>\n` +
            `\t<script src="${config.wds.hotFile }"></script>\n` +
            `\t<script src="${config.wds.publicPath + config.wds.filename}"></script>\n` +
            '</body>'
          );
          response.source = html;
          response.send();
          log(`Served ${correctUrl}\n`);
          
        }).catch(err => log('error', '!!! Error while reading HTML.', err));
      }).catch(err => log('error', '!!! Error while Phidippides.', err));
    });
  });
})();

if (true) {
  const {startActivists, stopActivists} = createActivists(10, 1000, 10000);
  startActivists();
}
