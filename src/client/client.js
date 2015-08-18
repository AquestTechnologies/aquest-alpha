import React                   from 'react';
import ReactDOM                from 'react-dom';
import Router, { Route }       from 'react-router';  
import { reduxRouteComponent } from 'redux-react-router';
import BrowserHistory          from 'react-router/lib/BrowserHistory';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import reducers       from '../shared/reducers';
import protectRoutes  from '../shared/routes';
import registerShortcuts   from './lib/registerShortcuts';
import registerSideEffects from './lib/registerSideEffects';
import registerWebSocket   from './lib/registerWebSocket';
import log, { logWelcome } from '../shared/utils/logTailor';
import promiseMiddleware   from '../shared/utils/promiseMiddleware';

(() => {
  const d = new Date();
  
  logWelcome(0);
  log('... Initializing Redux and React Router');
  
  // State from server --> Immutable maps
  const stateFromServer = window.STATE_FROM_SERVER || {};
  /*const immutableKeys = stateFromServer.immutableKeys; 
  if (immutableKeys instanceof Array) immutableKeys.forEach(key => stateFromServer[key] = Immutable.fromJS(stateFromServer[key]));
  delete stateFromServer.immutableKeys;*/
  
  // Store creation
  const store = applyMiddleware(promiseMiddleware)(createStore)(combineReducers(reducers), stateFromServer);
  registerShortcuts(store.getState);
  
  // Gère les trailing slash des url
  // const url = routerState.pathname;
  // if (url.slice(-1) === '/' && url !== '/') {
  //   router.replaceWith(url.slice(0,-1), null, routerState.query);
  //   return;
  // }

  const history = new BrowserHistory();
  const app = ReactDOM.render(
    <Router history={history}>
      <Route children={protectRoutes(store)} component={reduxRouteComponent(store)} />
    </Router>,
    document.getElementById('mountNode'),
    () => log(`... App rendered in ${new Date() - d}ms.`)
  );
  
  registerSideEffects(store, app.transitionTo);
  registerWebSocket(store);

})();

require('./css/app.css');
