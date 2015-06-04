//Doit etre deplacée dans le dossier client
import React  from 'react';
import Router from 'react-router';  
import routes from './routes.jsx';

import Flux from './flux.js';
import FluxComponent from 'flummox/component';
import performRouteHandlerStaticMethod from './utils/performRouteHandlerStaticMethod.js';

//Copié depuis la doc de flummox
//Initialize flux
const flux = new Flux();

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
    document.getElementById('mountNode')
  );
});