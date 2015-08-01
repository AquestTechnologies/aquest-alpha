import React                   from 'react';
import ReactDOM                from 'react-dom';
import Immutable               from 'immutable';
import Router, { Route }       from 'react-router';  
import { reduxRouteComponent } from 'redux-react-router';
import BrowserHistory          from 'react-router/lib/BrowserHistory';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import makeJourney, { routeGuard } from '../shared/routes.jsx';
import reducers       from '../shared/reducers';
import registerShortcuts   from './lib/registerShortcuts';
import registerSideEffects from './lib/registerSideEffects';
import log, { logWelcome } from '../shared/utils/logTailor.js';
import promiseMiddleware   from '../shared/utils/promiseMiddleware.js';

(() => {
  logWelcome(0);
  log('... Initializing Redux and React Router');
  
  // State from server --> Immutable maps
  const stateFromServer = window.STATE_FROM_SERVER || {};
  const immutableKeys = stateFromServer.immutableKeys;
  delete stateFromServer.immutableKeys;
  for (let key in stateFromServer) {
    let immutable = false;
    immutableKeys.forEach(immutableKey => {
      if (immutableKey === key) immutable = true;
    });
    stateFromServer[key] = immutable ? Immutable.fromJS(stateFromServer[key]) : stateFromServer[key];
  }
  
  // Store creation
  const store = applyMiddleware(promiseMiddleware)(createStore)(combineReducers(reducers), stateFromServer);
  const safe  = routeGuard(store);
  registerShortcuts(store.getState);
  
  // Gère les trailing slash des url
  // const url = routerState.pathname;
  // if (url.slice(-1) === '/' && url !== '/') {
  //   router.replaceWith(url.slice(0,-1), null, routerState.query);
  //   return;
  // }

  const d = new Date();
  const history = new BrowserHistory();
  const app = ReactDOM.render(
    <Router history={history}>
      <Route children={makeJourney(safe)} component={reduxRouteComponent(store)} />
    </Router>,
    document.getElementById('mountNode'),
    () => log(`... App rendered in ${new Date() - d}ms.`)
  );
  
  registerSideEffects(store, app.transitionTo);

})();

require('./css/app.css');
