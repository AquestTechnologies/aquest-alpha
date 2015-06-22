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

console.log('Welcome to Aquest v0!');
console.log('... Initializing flux');
// Initialize flux
// const flux = new Flux();
// const initialState = window.STATE_FROM_SERVER;
const dispatcher = createDispatcher(
  composeStores(reducers),
  [promiseMiddleware]
);
const store = createRedux(dispatcher);
/*
// On extrait le state serialisé du DOM
try {
  let serializedState = document.getElementById('mountNode').getAttribute("state-from-server");
  if (serializedState) {
    document.getElementById('mountNode').removeAttribute("state-from-server");
    var stateFromServer = JSON.parse(serializedState);  
    // On l'injecte dans flux, Les attr d'une const ne sont pas protégés
    for (let store in flux._stores) {
      flux._stores[store].state = stateFromServer[store];
    }
    log('... State from server injected');
  }
} catch(err) {
    log('!!! Error while serializing state.');
    log(err);
}*/

// Initialise le router
const router = Router.create({ 
  routes: routes,
  location: Router.HistoryLocation
});

// Render app
let c = 1; //L'app a déjà été render par le server une fois
router.run( (Handler, routerState) => {
  if (routerState.pathname.slice(-1) === '/' && routerState.pathname !== '/') {
    router.replaceWith(routerState.pathname.slice(0,-1), null, routerState.query);
    return;
  }
  c++;
  routerState.c = c;
  console.log('__________ ' + c + ' router.run ' + routerState.pathname + ' __________');
  
  console.log('... Entering phidippides');
  phidippides(routerState, store.getState(), store.dispatch).then(function() {
    console.log('... Exiting phidippides');
    console.log('State :');
    console.log(store.getState());
    console.log('... Entering React.render');
    try {
      React.render(
        <Provider redux={store}>
          {() =>
            <Handler {...routerState} />
          }
        </Provider>,
        document.getElementById('mountNode'),
        function() { // Callback
          console.log('... App rendered');
        }
      );
    } 
    catch(err) {
      console.log('error', '!!! React.render');
      console.error(err); //.error est important pour voir la stacktrace
    }
    
  }).catch(function(err) {
    console.log('error', '!!! Phidippides');
    console.error(err); //.error est important pour voir la stacktrace
  });
});

require('./less/app.less');