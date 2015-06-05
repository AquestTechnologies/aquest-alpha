//Doit etre deplacée dans le dossier client
import React  from 'react';
import Router from 'react-router';  
import routes from './routes.jsx';

import Flux from './flux.js';
import FluxComponent from 'flummox/component';
import performRouteHandlerStaticMethod from './utils/performRouteHandlerStaticMethod.js';

import Websocket from 'socket.io-client';
var io = Websocket('http://130.211.68.244:8081');

let functionReviver = function (key, value) {
    if (key === "") return value;
    
    if (typeof value === 'string') {
        var rfunc = /function[^\(]*\(([^\)]*)\)[^\{]*{([^\}]*)\}/,
            match = value.match(rfunc);
        
        if (match) {
            var args = match[1].split(',').map(function(arg) { return arg.replace(/\s+/, ''); });
            return new Function(args, match[2]);
        }
    }
    return value;
};
//Initialize flux
let fluxFromServer = document.getElementById('mountNode').getAttribute("flux-from-server");
if (fluxFromServer) {
  var flux = JSON.parse(fluxFromServer, functionReviver);  
} else {
  var flux = new Flux();
}
var flux2 = new Flux();
console.log(flux);
console.log(flux2);
console.log(flux === flux2);

const router = Router.create({ 
  routes: routes,
  location: Router.HistoryLocation
});

//Render app
router.run(async (Handler, state) => {
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