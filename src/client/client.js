require('./less/app.less');
import React        from 'react';
import Router       from 'react-router';  
// import config       from '../../config/client.js';
import routes       from '../shared/routes.jsx';
import phidippides  from '../shared/utils/phidippides.js';
import {default as log, logWelcome} from '../shared/utils/logTailor.js';

import { createRedux, createDispatcher, composeStores } from 'redux';
import promiseMiddleware from '../shared/utils/promiseMiddleware.js';
import * as reducers from '../shared/reducers';

import { Provider } from 'redux/react';

/*import Websocket from 'socket.io-client';
const io = Websocket('http://130.211.68.244:8081'); //Prendre le bon port

io.on('message', function (message) {
  log('___ Server says ' + message);
});*/

(function app() {
  logWelcome(false);
  log('... Initializing Redux and React Router');
  
  const stateFromServer = window.STATE_FROM_SERVER || {};
  // log('stateFromServer ' + stateFromServer);
  let dispatcher = createDispatcher(
    composeStores(reducers),
    [promiseMiddleware]
  );
  let store = createRedux(dispatcher, stateFromServer);
  // On extrait le state serialisé du DOM
  
  // Initialise le router
  let router = Router.create({ 
    routes: routes,
    location: Router.HistoryLocation
  });
  
  // Render app
  let c = 0;
  router.run( (Handler, routerState) => {
    // Gère les trailing slash des url
    if (routerState.pathname.slice(-1) === '/' && routerState.pathname !== '/') {
      router.replaceWith(routerState.pathname.slice(0,-1), null, routerState.query);
      return;
    }
    c++;
    routerState.c = c;
    log('__________ ' + c + ' router.run ' + routerState.pathname + ' __________');
    
    
    log('... Entering phidippides');
    phidippides(routerState, store.getState(), store.dispatch).then(function() {
      log('info', '... Exiting phidippides', '... Entering React.render');
      
      try {
        React.render(
          <Provider redux={store}>
            {() =>
              <Handler {...routerState} />
            }
          </Provider>,
          document.getElementById('mountNode'),
          function() { // Callback
            log('... App rendered');
          }
        );
      } 
      catch(err) {
        log('error', '!!! React.render', err);
      }
      
    }).catch(function(err) {
      log('error', '!!! Phidippides', err);
    });
  });

})();
