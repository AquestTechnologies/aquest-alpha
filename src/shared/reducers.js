import log from './utils/logTailor';
import Immutable from 'immutable';

import * as actionCreators from './actionCreators';

const { 
  SUCCESS_readUniverse,
  SUCCESS_readUniverses,
  SUCCESS_readInventory,
  SUCCESS_readChat,
  SUCCESS_readTopic,
  SUCCESS_readTopicContent,
  SUCCESS_createUser,
  SUCCESS_createTopic,
} = (() => {
  const at = {};
  Object.keys(actionCreators)
    .map(key => actionCreators[key].getTypes())
    .reduce((a, b) => a.concat(b), [])
    .map(type => at[type] = type);
  return at;
})();

// Doit être exporté en premier pour logger avant les autres
export function records(state = [], action) {
  log('.R. ' + action.type);
  return [
    ...state,
    {action: action, date: new Date()}
  ];
}

export function universes(state = Immutable.Map(), action) {
  let newState;
  switch (action.type) {
    
  case SUCCESS_readUniverse:
    return state.set(action.payload.id, fromJSGreedy(action.payload));

  case SUCCESS_readUniverses:
    newState = state;
    action.payload.forEach(universe => {
      if (!newState.get(universe.id)) newState = newState.set(universe.id, fromJSGreedy(universe));
    });
    return newState;
    
  case SUCCESS_readInventory:
    const d = new Date();
    return state.setIn([action.params, 'lastInventoryUpdate'], d.getTime());
  
  default:
    return state;
  }
}

export function chats(state = Immutable.Map(), action) {
  switch (action.type) {
    
  case SUCCESS_readChat:
    log('action.params');
    log(action.params);
    log('action.payload');
    log(action.payload);
    return state.set(action.payload.id, fromJSGreedy(action.payload));
    
  default:
    return state;
  }
}

export function topics(state = Immutable.Map(), action) {
  let newState;
  switch (action.type) {
    
  case SUCCESS_readInventory:
    newState = state;
    action.payload.forEach(topic => newState = newState.set(topic.id, fromJSGreedy(topic)));
    return newState;
    
  case SUCCESS_readTopic:
    return state.set(action.payload.id, fromJSGreedy(action.payload));
    
  
  case SUCCESS_readTopicContent:
    return state.setIn([action.params, 'content'], fromJSGreedy(action.payload));
    
  case SUCCESS_createTopic:
    return state.set(action.params.id, fromJSGreedy(action.payload));
    
  default:
    return state;
  }
}

export function users(state = Immutable.Map(), action) {
  let newState;
  switch (action.type) {
    
  case SUCCESS_createUser:
    action.params.redirect();
    return state.set(action.payload.id, fromJSGreedy(action.payload));
    
  default:
    return state;
  }
}

// From the Immutable.js Github wiki
function fromJSGreedy(js) {
  return typeof js !== 'object' || js === null ? js :
    Array.isArray(js) ? 
      Immutable.Seq(js).map(fromJSGreedy).toList() :
      Immutable.Seq(js).map(fromJSGreedy).toMap();
}
