require('./less/app.less');
import React                            from 'react';
import {createStore, composeReducers}   from 'redux';
import Immutable                        from 'immutable';
import {Provider}                       from 'redux/react';
import Router                           from 'react-router';  
import key                              from './vendor/keymaster';
import * as reducers                    from '../shared/reducers';
import routes                           from '../shared/routes.jsx';
import {default as log, logWelcome}     from '../shared/utils/logTailor.js';
import phidippides                      from '../shared/utils/phidippides2.js';
import promiseMiddleware                from '../shared/utils/promiseMiddleware.js';


/*import Websocket from 'socket.io-client';
const io = Websocket('http://130.211.68.244:8081'); //Prendre le bon port

io.on('message', function (message) {
  log('_w_ Server says ' + message);
});*/

(function app() {
  
  logWelcome(false);
  log('... Initializing Redux and React Router');
  
  let clientState = {};
  const stateFromServer = window.STATE_FROM_SERVER || {};
  
  if (stateFromServer.hasOwnProperty('immutableKeys')) {
    const immutableKeys = stateFromServer.immutableKeys;
    delete stateFromServer.immutableKeys;
    let immutable;
    
    for (let key in stateFromServer) {
      immutable = false;
      immutableKeys.forEach(immutableKey => {
        if (immutableKey === key) immutable = true;
      });
      clientState[key] = immutable ? Immutable.fromJS(stateFromServer[key]) : stateFromServer[key];
    }
  } else {
    clientState = stateFromServer;
  }
  // log('info', 'clientState :', clientState);
  
  const store = createStore(
    composeReducers(reducers),
    clientState,
    [promiseMiddleware]
  );
  // log('info', 'state :', store.getState());
  
  // Initialise le router
  let router = Router.create({ 
    routes: routes,
    location: Router.HistoryLocation
  });
  
  // Render app
  let c = 0;
  router.run((Handler, routerState) => {
    // Gère les trailing slash des url
    if (routerState.pathname.slice(-1) === '/' && routerState.pathname !== '/') {
      router.replaceWith(routerState.pathname.slice(0,-1), null, routerState.query);
      return;
    }
    c++;
    log('__________ ' + c + ' router.run ' + routerState.pathname + ' __________');
    
    let d = new Date();
    log('... Entering phidippides');
    phidippides(routerState, store.getState(), store.dispatch).then(() => {
      log('info', '... Exiting phidippides after ' + (new Date() - d) + 'ms', '... Entering React.render');
      
      try {
        React.render(
          <Provider store={store}>
            {() => <Handler {...routerState} />}
          </Provider>,
          document.getElementById('mountNode'),
          () => log('... App rendered')
        );
      } 
      catch(err) {
        log('error', '!!! React.render', err);
      }
      
    }).catch(err => log('error', '!!! Phidippides', err));
  });
  
  key('ctrl+q', () => {
    console.log(store.getState());
    return false;
  });
  key('ctrl+alt+u', () => {
    console.log(store.getState().universes);
    return false;
  });
  key('ctrl+alt+q', () => {
    console.log(store.getState().records);
    return false;
  });

})();
