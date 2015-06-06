//Doit etre deplacée dans le dossier client
import React  from 'react';
import Router from 'react-router';  
import routes from './routes.jsx';

import Flux from './flux.js';
import FluxComponent from 'flummox/component';
import performRouteHandlerStaticMethod from './utils/performRouteHandlerStaticMethod.js';

import Websocket from 'socket.io-client';
var io = Websocket('http://130.211.68.244:8081');

// Initialize flux
const flux = new Flux();
// On extrait le state serialisé du DOM
let serializedState = document.getElementById('mountNode').getAttribute("state-from-server");
if (serializedState) {
  document.getElementById('mountNode').removeAttribute("state-from-server");
  var stateFromServer = JSON.parse(serializedState);  
  // On l'injecte dans flux, Les attr d'une const ne sont pas protégés
  for (let store in flux._stores) {
    flux._stores[store].state = stateFromServer[store];
  }
}

const router = Router.create({ 
  routes: routes,
  location: Router.HistoryLocation
});

// Render app
let counter = 0;
router.run(async (Handler, state) => {
  counter++;
  console.log('__________ ' + counter + ' router.run __________');
  const routeHandlerInfo = { state, flux };
  
  await performRouteHandlerStaticMethod(state.routes, 'routerWillRun', routeHandlerInfo);
  
  React.render(
    <FluxComponent flux={flux}>
      <Handler {...state} />
    </FluxComponent>,
    document.getElementById('mountNode'),
    function() {
      console.log('... React.render Done');
    }
  );
});