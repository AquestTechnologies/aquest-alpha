import fs                 from 'fs';
import Hapi               from 'hapi';
import React              from 'react';
import ReactDOM from 'react-dom/server';
import Immutable          from 'immutable';
import {Provider}         from 'react-redux';
import Router, { Route } from 'react-router';
import validateJWT        from './lib/validateJWT';
import * as reducers      from '../shared/reducers';
import routes             from '../shared/routes.jsx';
import {createActivists}  from './lib/activityGenerator';
import devConfig          from '../../config/development.js';
import log, {logRequest}  from '../shared/utils/logTailor.js';
import phidippides        from '../shared/utils/phidippides.js';
import promiseMiddleware  from '../shared/utils/promiseMiddleware.js';
import { reduxRouteComponent } from 'redux-react-router';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import Location from 'react-router/lib/Location';

import App         from '../shared/components/App';
// import Home        from '../shared/components/Home';
import Universe    from '../shared/components/Universe';
import Inventory   from '../shared/components/Inventory';
import Topic       from '../shared/components/Topic';
import NewTopic    from '../shared/components/NewTopic';
import NewUniverse from '../shared/components/NewUniverse';
import Explore     from '../shared/components/Explore';
import User        from '../shared/components/User';
// import NotFound    from '../shared/components/NotFound';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
log(`Starting server in ${process.env.NODE_ENV} mode...`);

//lance webpack-dev-server si on est pas en production
if (process.env.NODE_ENV === 'development') require('./dev_server.js')();

const {api, ws, wds, jwt} = devConfig();
const server = new Hapi.Server();

// Distribution des ports pour l'API et les websockets
server.connection({ port: api.port, labels: ['api'] });
server.connection({ port: ws.port,  labels: ['ws']  });

// Auth strategy registration
server.register(require('hapi-auth-jwt2'), err => {
  if (err) throw err;
  
  server.auth.strategy('jwt', 'jwt', true, {
    key: jwt.key,      
    validateFunc: validateJWT,         
    verifyOptions: { algorithms: ['HS256'] }
  });
  
  log('JWT Authentication registered');
});
  
// Registration des plugins websocket et API
server.register(
  [
    {register: require('./plugins/api')},
    {register: require('./plugins/websocket')},
  ], 
  err => {
    log('API and WS plugins registered');
    if (err) throw err;
    
    // Routes
    server.route({
      method: 'GET',
      path: '/',
      config: { auth: false },
      handler: (request, reply) => prerender(request, reply)
    });
    
    server.route({
      method: 'GET',
      path: '/{p*}',
      config: { auth: false },
      handler: (request, reply) => prerender(request, reply)
    });
    
    server.route({
      method: 'GET',
      path: '/img/{filename}',
      config: { auth: false },
      handler: (request, reply) => reply.file('dist/img/' + request.params.filename)
    });
  }
);

// Prerendering
function prerender(request, reply) {
  
  // Affiche les infos de la requete
  logRequest(request);
  
  // Intercepte la réponse
  const response = reply.response().hold();
  const d = new Date();
  
  // transforme coco.com/truc/ en coco.com/truc
  const requestUrl = request.url.path;
  const url = requestUrl.slice(-1) === '/' && requestUrl !== '/' ? requestUrl.slice(0, -1) : requestUrl;
  
  // Initialise le router
  // const router = Router.create({
  //   routes: routes,
  //   location: url
  // });
  var location = new Location(url);
  // Initialise une nouvelle instance redux  
  const store = applyMiddleware(promiseMiddleware)(createStore)(combineReducers(reducers), {});
  
  const routex = <Route component={reduxRouteComponent(store)} children={routes} />;
  // Match la location et les routes, et renvoie le bon layout (Handler) et le state
  Router.run(routex, location, (err, initialState) => {
    log('_____________ router.run _____________');
    
    // Initialise les stores
    log('... Entering phidippides');
    const dd = new Date();
    phidippides(initialState, store.dispatch).then(() => {
    
      log(`... Exiting phidippides (${new Date() - dd}ms)`);
      log('... Entering React.renderToString');
      try {
        var mountMeImFamous = ReactDOM.renderToString(
          <Router {...initialState} children={routex} />
        );
      } 
      catch(err) { log('!!! Error while React.renderToString', err, err.stack); }
      log('... Exiting React.renderToString');
      
      // Le fichier html est partagé, penser a prendre une version minifée en cache en prod
      new Promise((re, rt) => fs.readFile('index.html', 'utf8', (err, res) => err ? rt(err) : re(res)))
      .then(html => {
          
        // On extrait le contenu du mountNode 
        // Il est ici imperatif que le mountNode contienne du texte unique et pas de </div>
        let placeholder = html.split('<div id="mountNode">')[1].split('</div>')[0]; //à mod.
        
        // Passage du state dans window
        const serverState = store.getState();
        delete serverState.records;
        delete serverState.effects;
        serverState.immutableKeys = [];
        for (let key in serverState) {
          if (Immutable.Map.isMap(serverState[key])) serverState.immutableKeys.push(key); //Mutation !
        }
        
        response.source = html
          .replace(placeholder, mountMeImFamous)
          .replace('</body>',
            `\t<script>window.STATE_FROM_SERVER=${JSON.stringify(serverState)}</script>\n` +
            `\t<script src="${wds.hotFile }"></script>\n` +
            `\t<script src="${wds.publicPath + wds.filename}"></script>\n` +
            '</body>' );
        
        const token = request.state.jwt;
        if (token) response.state('jwt', token, {
          ttl: jwt.ttl
        });
          
        response.send();
        log(`Served ${url} in ${new Date() - d}ms.\n`);
        
        }, err => log('!!! Error while reading HTML', err));
    }, err => log('!!! Error while Phidippides', err));
  });
}

// Démarrage du server
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
              '          |_|');
  if (0) {
    const {startActivists, stopActivists} = createActivists(4, 1000, 10000);
    startActivists();
  }
});
