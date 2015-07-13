require('./css/app.css');
import React                            from 'react';
import {createStore, composeReducers}   from 'redux';
import Immutable                        from 'immutable';
import {Provider}                       from 'redux/react';
import Router                           from 'react-router';  
import key                              from './vendor/keymaster';
import * as reducers                    from '../shared/reducers';
import routes                           from '../shared/routes.jsx';
import {default as log, logWelcome}     from '../shared/utils/logTailor.js';
import promiseMiddleware                from '../shared/utils/promiseMiddleware.js';


/*import Websocket from 'socket.io-client';
const io = Websocket('http://130.211.68.244:8081'); //Prendre le bon port

io.on('message', function (message) {
  log('_w_ Server says ' + message);
});*/

(() => {
  
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
    log(`__________ ${c} router.run ${routerState.pathname} __________`);
    
    let d = new Date();
    log('... Entering React.render');
      
    React.render(
      <Provider store={store}>
        {() => <Handler {...routerState} />}
      </Provider>,
      document.getElementById('mountNode'),
      () => log('... App rendered')
    );
  });
  
  
  key('ctrl+shift+1', () => {
    console.log('state :', store.getState());
    return false;
  });
  key('ctrl+shift+2', () => {
    console.log('universes :', store.getState().universes.toJS());
    return false;
  });
  key('ctrl+shift+3', () => {
    const {universeId} = router.getCurrentParams();
    console.log('universe :', store.getState().universes.toJS()[universeId]);
    return false;
  });
  key('ctrl+shift+4', () => {
    const state = store.getState();
    console.log('topics :', state.topics.toJS());
    return false;
  });
  key('ctrl+shift+5', () => {
    const state = store.getState();
    const {topicId} = router.getCurrentParams();
    console.log('topic :', state.topics.toJS()[topicId]);
    return false;
  });
  key('ctrl+shift+6', () => {
    console.log('chats :', store.getState().chats.toJS());
    return false;
  });
  key('ctrl+shift+7', () => {
    const state = store.getState();
    const {universeId, topicId} = router.getCurrentParams();
    const chatId = topicId === undefined ? state.universes.toJS()[universeId].chatId : state.topics.toJS()[topicId].chatId;
    console.log('chat :', state.chats.toJS()[chatId]);
    return false;
  });
  key('ctrl+shift+9', () => {
    console.log('records :', store.getState().records);
    return false;
  });

})();
