//Doit etre deplacée dans le dossier client !!!
import Flux from './flux.js';
import FluxComponent from 'flummox/component';
import performRouteHandlerStaticMethod from './utils/performRouteHandlerStaticMethod.js';

import React  from 'react';
import Router from 'react-router';  
import routes from './routes.jsx';

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
let c = 0;
router.run( async (Handler, routerState) => {
  c++;
  routerState.c = c;
  console.log('__________ ' + c + ' router.run ' + routerState.pathname + ' __________');
  
  await performRouteHandlerStaticMethod(routerState.routes, 'populateFluxState', { flux, routerState } );
  console.log('... Exiting performRouteHandlerStaticMethod');
  
  console.log('... Entering React.render');
  React.render(
    <FluxComponent flux={flux}>
      <Handler {...routerState} />
    </FluxComponent>,
    document.getElementById('mountNode'),
    function() {
      // Callback
      console.log('... App rendered');
    }
  );
});
