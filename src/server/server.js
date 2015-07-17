import fs         from 'fs';
import Hapi       from 'hapi';
import React      from 'react';
import Immutable  from 'immutable';
import {Provider} from 'react-redux';
import Router     from 'react-router';

import {createStore, combineReducers, applyMiddleware} from 'redux';

import * as reducers      from '../shared/reducers';
import routes             from '../shared/routes.jsx';
import {createActivists}  from './lib/activityGenerator';
import devConfig          from '../../config/development.js';
import log, {logRequest}  from '../shared/utils/logTailor.js';
import phidippides        from '../shared/utils/phidippides.js';
import promiseMiddleware  from '../shared/utils/promiseMiddleware.js';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
log('node', `Starting server in ${process.env.NODE_ENV} mode...`);

//lance webpack-dev-server si on est pas en production
if (process.env.NODE_ENV === 'development') require('./dev_server.js')();

const config = devConfig();
const server = new Hapi.Server();

// Distribution des ports pour l'API et les websockets
server.connection({ port: config.api.port, labels: ['api'] });
server.connection({ port: config.ws.port,  labels: ['ws']  });

// Registration des plugins websocket et API
server.register(
  [
    {register: require('./plugins/websocket')},
    {register: require('./plugins/api')}
  ], 
  err => {
    if (err) throw err;
  }
);

// Routes
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
server.decorate('reply', 'prerenderer', (request, reply) => {
  
  // Intercepte la réponse
  const response = reply.response().hold();
  const d = new Date();
  
  // Affiche les infos de la requete
  logRequest(request);
  
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
  const requestUrl = request.url.path;
  const url = requestUrl.slice(-1) === '/' && requestUrl !== '/' ? requestUrl.slice(0, -1) : requestUrl;
  
  // Initialise le router
  const router = Router.create({
    routes: routes,
    location: url
  });
  
  // Match la location et les routes, et renvoie le bon layout (Handler) et le state
  router.run((Handler, routerState) => {
    log('_____________ router.run _____________');

    // Initialise une nouvelle instance flux  
    const store = applyMiddleware(promiseMiddleware)(createStore)(combineReducers(reducers), {});
    
    // Initialise les stores
    log('... Entering phidippides');
    const dd = new Date();
    phidippides(routerState, store.dispatch).then(
      () => {
      
        log('info', `... Exiting phidippides (${new Date() - dd}ms)` , '... Entering React.renderToString');
        
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
        readFile('index.html', 'utf8').then(
          html => {
            
            // On extrait le contenu du mountNode 
            // Il est ici imperatif que le mountNode contienne du texte unique et pas de </div>
            let placeholder = html.split('<div id="mountNode">')[1].split('</div>')[0]; //à mod.
            
            // Passage du state dans window
            const serverState = store.getState();
            serverState.immutableKeys = [];
            for (let key in serverState) {
              if (Immutable.Map.isMap(serverState[key])) serverState.immutableKeys.push(key); //Mutation !
            }
            
            response.source = html
              .replace(placeholder, mountMeImFamous)
              .replace('</body>',
                `\t<script>window.STATE_FROM_SERVER=${JSON.stringify(serverState)}</script>\n` +
                `\t<script src="${config.wds.hotFile }"></script>\n` +
                `\t<script src="${config.wds.publicPath + config.wds.filename}"></script>\n` +
                '</body>'
              );
            response.send();
            log(`Served ${url} in ${new Date() - d}ms.\n`);
          },
          error => log('error', '!!! Error while reading HTML', error)
        );
      },
      error => log('error', '!!! Error while Phidippides', error)
    );
  });
});

// Démarrage du server
server.start(
  () => {
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
    if (0) {
      const {startActivists, stopActivists} = createActivists(4, 1000, 10000);
      startActivists();
    }
  }
);
