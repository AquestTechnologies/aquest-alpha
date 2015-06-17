import Flux from '../shared/flux.js';
import phidippides from '../shared/utils/phidippides.js';

import React  from 'react';
import Router from 'react-router';  
import routes from '../shared/routes.jsx';

import Websocket from 'socket.io-client';
const io = Websocket('http://130.211.68.244:8081');

io.on('message', function (message) {
  console.log('___ Server says ' + message);
});

console.log('Welcome to Aquest v0!');
console.log('... Initializing flux');
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
    console.log('... State from server injected');
  }
} catch(err) {
    console.log('!!! Error while serializing state.');
    console.log(err);
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
  console.log('__________ ' + c + ' router.run ' + routerState.pathname + ' __________');
  
  console.log('... Entering phidippides');
  phidippides(routerState, flux).then(function() {
    console.log('... Exiting phidippides');
    
    console.log('... Entering React.render');
    React.render(
      <Handler {...routerState} flux={flux} />,
      document.getElementById('mountNode'),
      function() { // Callback
        console.log('... App rendered');
      }
    );
  }).catch(function(err) {
    console.log('!!! Phidippides ' + err);
  });
});
