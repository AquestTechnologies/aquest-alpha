require('./css/app.css');
import React                            from 'react';
import Immutable                        from 'immutable';
import {Provider}                       from 'react-redux';
import Router                           from 'react-router';  
import key                              from './vendor/keymaster';
import * as reducers                    from '../shared/reducers';
import routes                           from '../shared/routes.jsx';
import log, {logWelcome}                from '../shared/utils/logTailor.js';
import promiseMiddleware                from '../shared/utils/promiseMiddleware.js';
import {createStore, combineReducers, applyMiddleware}   from 'redux';

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
  
  const immutableKeys = stateFromServer.immutableKeys;
  delete stateFromServer.immutableKeys;
  
  for (let key in stateFromServer) {
    let immutable = false;
    immutableKeys.forEach(immutableKey => {
      if (immutableKey === key) immutable = true;
    });
    clientState[key] = immutable ? Immutable.fromJS(stateFromServer[key]) : stateFromServer[key];
  }
  // log('info', 'clientState :', clientState);
  
  const store = applyMiddleware(promiseMiddleware)(createStore)(combineReducers(reducers), clientState);
  // log('info', 'state :', store.getState());
  
  // Initialise le router
  const router = Router.create({ 
    routes: routes,
    location: Router.HistoryLocation
  });
  
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
  
    React.render(
      <Provider store={store}>
        {() => <Handler {...routerState} />}
      </Provider>,
      document.getElementById('mountNode'),
      () => log(`... App rendered in ${new Date() - d}ms.`)
    );
  });
  
  
  key('ctrl+shift+1', () => console.log('state :', store.getState()));
  
  key('ctrl+shift+2', () => console.log('universes :', store.getState().universes.toJS()));
  
  key('ctrl+shift+3', () => console.log('universe :', store.getState().universes.toJS()[router.getCurrentParams().universeId]));
  
  key('ctrl+shift+4', () => console.log('topics :', store.getState().topics.toJS()));
  
  key('ctrl+shift+5', () => console.log('topic :', store.getState().topics.toJS()[router.getCurrentParams().topicId]));
  
  key('ctrl+shift+6', () => console.log('chats :', store.getState().chats.toJS()));
  
  key('ctrl+shift+7', () => {
    const {universes, topics, chats} = store.getState();
    const {universeId, topicId} = router.getCurrentParams();
    const topic = topics.toJS()[topicId];
    const universe = universes.toJS()[universeId];
    console.log('chat : ', universe ? chats.toJS()[topicId ? topic.chatId : universe.chatId] : undefined);
  });
  
  key('ctrl+shift+8', () => console.log('users :', store.getState().users.toJS()));
  
  key('ctrl+shift+9', () => console.log('records :', store.getState().records));

})();
