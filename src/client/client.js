require('./css/app.css');
import React                from 'react';
import Immutable            from 'immutable';
import {Provider}           from 'react-redux';
import Router               from 'react-router';  
import * as reducers        from '../shared/reducers';
import routes               from '../shared/routes.jsx';
import registerShortcuts    from './lib/registerShortcuts';
import registerSideEffects  from './lib/registerSideEffects';
import log, {logWelcome}    from '../shared/utils/logTailor.js';
import promiseMiddleware    from '../shared/utils/promiseMiddleware.js';
import {createStore, combineReducers, applyMiddleware}   from 'redux';

/*import Websocket from 'socket.io-client';
const io = Websocket('http://130.211.68.244:8081'); //Prendre le bon port

io.on('message', function (message) {
  log('_w_ Server says ' + message);
});*/

(() => {
  
  logWelcome(false);
  log('... Initializing Redux and React Router');
  
  const router = Router.create({ 
    routes: routes,
    location: Router.HistoryLocation
  });
  
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
  
  registerSideEffects(store, router);
  registerShortcuts(store.getState, router.getCurrentParams);
  
  // Render app
  let c = 0;
  router.run((Handler, routerState) => {
    
    // Gère les trailing slash des url
    const url = routerState.pathname;
    if (url.slice(-1) === '/' && url !== '/') {
      router.replaceWith(url.slice(0,-1), null, routerState.query);
      return;
    }
    
    c++;
    const d = new Date();
    log(`__________ ${c} router.run ${url} __________`);
    
    try { 
      React.render(
        <Provider store={store}>
          {() => <Handler {...routerState} />}
        </Provider>,
        document.getElementById('mountNode'),
        () => log(`... App rendered in ${new Date() - d}ms.`)
      );
    } 
    catch(err) {
      log('error', '!!! Error while React.renderToString', err);
    }
  });

})();
