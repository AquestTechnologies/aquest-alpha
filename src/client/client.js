import React                from 'react';
import ReactDOM from 'react-dom';
import { reduxRouteComponent } from 'redux-react-router';
import Immutable            from 'immutable';
import {Provider}           from 'react-redux';
import Router, { Route}             from 'react-router';  
import * as reducers        from '../shared/reducers';
import routes               from '../shared/routes.jsx';
import registerShortcuts    from './lib/registerShortcuts';
import registerSideEffects  from './lib/registerSideEffects';
import log, {logWelcome}    from '../shared/utils/logTailor.js';
import promiseMiddleware    from '../shared/utils/promiseMiddleware.js';

import BrowserHistory from 'react-router/lib/BrowserHistory';
import {createStore, combineReducers, applyMiddleware}   from 'redux';

(() => {
  
  logWelcome(false);
  log('... Initializing Redux and React Router');
  
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
  
  const store = applyMiddleware(promiseMiddleware)(createStore)(combineReducers(reducers), stateFromServer);
  registerShortcuts(store.getState);
  
  let c = 0;
    
  // Gère les trailing slash des url
  // const url = routerState.pathname;
  // if (url.slice(-1) === '/' && url !== '/') {
  //   router.replaceWith(url.slice(0,-1), null, routerState.query);
  //   return;
  // }
  
  c++;
  const d = new Date();
  const history = new BrowserHistory();
  const routex = <Route children={routes} component={reduxRouteComponent(store)} />;
  const app = ReactDOM.render(
    <Router history={history} children={routex} />,
    document.getElementById('mountNode'),
    () => log(`... App rendered in ${new Date() - d}ms.`)
  );
  registerSideEffects(store, app.transitionTo);

})();

require('./css/app.css');
