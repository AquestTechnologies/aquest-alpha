import React                   from 'react';
import Router, { Route }       from 'react-router';  
import { reduxRouteComponent } from 'redux-react-router';
import BrowserHistory          from 'react-router/lib/BrowserHistory';
import protectRoutes  from '../shared/routes';
import configureStore from '../shared/configureStore';
import registerShortcuts   from './lib/registerShortcuts';
import registerSideEffects from './lib/registerSideEffects';
import log, { logWelcome } from '../shared/utils/logTailor';


logWelcome(0);

const d = new Date();
const history = new BrowserHistory();
const store = configureStore(window.STATE_FROM_SERVER || {});

const app = React.render(
  <Router history={history}>
    <Route children={protectRoutes(store)} component={reduxRouteComponent(store)} />
  </Router>,
  document.getElementById('mountNode'),
  () => log(`... App rendered in ${new Date() - d}ms.`)
);

registerShortcuts(store.getState);
registerSideEffects(store, app.transitionTo);

require('./css/app.css');
