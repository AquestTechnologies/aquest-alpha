import React                   from 'react';
import Router, { Route }       from 'react-router';  
import { reduxRouteComponent } from 'redux-react-router';
import BrowserHistory          from 'react-router/lib/BrowserHistory';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import reducers       from '../shared/reducers';
import protectRoutes  from '../shared/routes';
import registerShortcuts   from './lib/registerShortcuts';
import registerSideEffects from './lib/registerSideEffects';
import log, { logWelcome } from '../shared/utils/logTailor';
import promiseMiddleware   from '../shared/middleware/promiseMiddleware';
import websocketMiddleware from '../shared/middleware/websocketMiddleware';

(() => {
  const d = new Date();
  
  logWelcome(0);
  log('... Initializing Redux and React Router');
  
  const stateFromServer = window.STATE_FROM_SERVER || {};
  
  const store = applyMiddleware(promiseMiddleware, websocketMiddleware)(createStore)(combineReducers(reducers), stateFromServer);
  
  const history = new BrowserHistory();
  
  const app = React.render(
    <Router history={history}>
      <Route children={protectRoutes(store)} component={reduxRouteComponent(store)} />
    </Router>,
    document.getElementById('mountNode'),
    () => log(`... App rendered in ${new Date() - d}ms.`)
  );
  
  registerShortcuts(store.getState);
  registerSideEffects(store, app.transitionTo);
  
})();

require('./css/app.css');
