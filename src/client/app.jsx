import Flux from '../shared/flux.js';
import phidippides from '../shared/utils/phidippides.js';
import log from '../shared/utils/logTailor.js';
import isClient from '../shared/utils/isClient.js';

import React  from 'react';
import Router from 'react-router';  
import routes from '../shared/routes.jsx';

import Websocket from 'socket.io-client';
const io = Websocket('http://130.211.68.244:8081');

io.on('message', function (message) {
  log('___ Server says ' + message);
});

log('Welcome to Aquest v0!');
log('... Initializing flux');
// Initialize flux
const flux = new Flux();

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
}

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
  log('__________ ' + c + ' router.run ' + routerState.pathname + ' __________');
  
  log('... Entering phidippides');
  phidippides(routerState, flux).then(function() {
    log('... Exiting phidippides');
    
    log('... Entering React.render');
    React.render(
      <Handler {...routerState} flux={flux} />,
      document.getElementById('mountNode'),
      function() { // Callback
        log('... App rendered');
      }
    );
  }).catch(function(err) {
    log('!!! Phidippides ' + err);
  });
});
