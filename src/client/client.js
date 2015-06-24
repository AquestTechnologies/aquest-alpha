import phidippides  from '../shared/middlewares/phidippides.js';
import log          from '../shared/utils/logTailor.js';
import React        from 'react';
import Router       from 'react-router';  
import routes       from '../shared/routes.jsx';

import { createRedux, createDispatcher, composeStores } from 'redux';
import promiseMiddleware from '../shared/middlewares/promiseMiddleware.js';
import * as reducers from '../shared/reducers';

import { Provider } from 'redux/react';

/*import Websocket from 'socket.io-client';
const io = Websocket('http://130.211.68.244:8081');

io.on('message', function (message) {
  log('___ Server says ' + message);
});*/

log('warn', 'Welcome to Aquest v0.0.2!');
log('... Initializing Redux and React Router');
/**
 * limite maximal par cookie pour le navigateur le plus exigeant 4093 bytes : http://browsercookielimits.squawky.net/
 * Nous envoyons 18,804 bytes ... https://mothereff.in/byte-counter 
 * 
 * Notre cookie semble passer dans le navigateur, mais dans document.cookie je n'ai pas tout
 * 
 * Yahoo il utilise window... (http://fluxible.io/api/bringing-flux-to-the-server.html)
 * Martyjs également (window.__marty : https://github.com/martyjs/marty/blob/master/dist/marty.js#L6182)
 * 
 * On peut toujours scinder le state du store en plusieurs cookie, mais c'est moche/triste
 */
 
//log('cookie : ' + JSON.stringify(document.cookie));
//let encodedStateFromServer = document.cookie.match(new RegExp('STATE_FROM_SERVER=([^;]+)'));
//log('encodedStateFromServer ' + JSON.stringify(encodedStateFromServer));
//let stateFromServer = encodedStateFromServer ? JSON.parse(window.atob(encodedStateFromServer[1])) : '';
let stateFromServer = window.STATE_FROM_SERVER ? window.STATE_FROM_SERVER : '';
log('stateFromServer ' + stateFromServer);
let dispatcher = createDispatcher(
  composeStores(reducers),
  [promiseMiddleware]
);
let store = createRedux(dispatcher, stateFromServer);
// On extrait le state serialisé du DOM

// Initialise le router
let router = Router.create({ 
  routes: routes,
  location: Router.HistoryLocation
});

// Render app
let c = 0;
router.run( (Handler, routerState) => {
  if (routerState.pathname.slice(-1) === '/' && routerState.pathname !== '/') {
    router.replaceWith(routerState.pathname.slice(0,-1), null, routerState.query);
    return;
  }
  c++;
  routerState.c = c;
  log('__________ ' + c + ' router.run ' + routerState.pathname + ' __________');
  
  
  log('... Entering phidippides');
  phidippides(routerState, store.getState(), store.dispatch).then(function() {
    log('... Exiting phidippides');
    log('State :');
    log(store.getState());
    log('... Entering React.render');
    try {
      React.render(
        <Provider redux={store}>
          {() =>
            <Handler {...routerState} />
          }
        </Provider>,
        document.getElementById('mountNode'),
        function() { // Callback
          log('... App rendered');
        }
      );
    } 
    catch(err) {
      log('!!! React.render');
      log('error', err);
    }
    
  }).catch(function(err) {
    log('!!! Phidippides');
    log('error', err);
  });
});

require('./less/app.less');