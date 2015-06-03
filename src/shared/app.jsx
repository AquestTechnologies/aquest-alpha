//Doit etre deplacée dans le dossier client
//require("babel/polyfill"); //ne devrai pas se trouver là mais notre compilation ES7 ne semble pas inclure de regenerator...
//require("babel-runtime/regenerator");
import React  from 'react';
import Router from 'react-router';  
import routes from './routes.jsx';

import Flux from './flux.js';
import FluxComponent from 'flummox/component';
import performRouteHandlerStaticMethod from './utils/performRouteHandlerStaticMethod.js';
import url from 'url';

/*Router.run(routes, Router.HistoryLocation, function (Handler) {  
  React.render(<Handler/>, document.getElementById('mountNode'));
});
*/

//Copié depuis la doc de flummox
// Initialize flux
const flux = new Flux();

const router = Router.create({
  routes: routes,
  location: Router.HistoryLocation
});

// Render app
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

// Intercept local route changes
// ca sert a quelque cose cette merde?
document.onclick = event => {
  const { toElement: target } = event;

  if (!target) return;

  if (target.tagName !== 'A') return;

  const href = target.getAttribute('href');

  if (!href) return;

  const resolvedHref = url.resolve(window.location.href, href);
  const { host, path } = url.parse(resolvedHref);

  if (host === window.location.host) {
    event.preventDefault();
    router.transitionTo(path);
  }
};