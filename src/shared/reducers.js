import log from './utils/logTailor';
import Immutable from 'immutable';

import * as actionCreators from './experiment';

const { 
  SUCCESS_getUniverse,
  SUCCESS_getUniverses,
  SUCCESS_getInventory,
  SUCCESS_getChat,
  SUCCESS_getTopic,
  SUCCESS_getTopicContent,
  SUCCESS_postUser
} = (() => {
  let at = {};
  const types = Object.keys(actionCreators)
    .map(key => actionCreators[key].getTypes())
    .reduce((a, b) => a.concat(b));
  types.forEach(type => at[type] = type);
  return at;
})();

// Doit être exporté en premier pour logger avant les autres
export function records(state = [], action) {
  log('.R. ' + action.type);
  return [
    ...state,
    {
      action: action,
      date: new Date()
    }
  ];
}

export function universes(state = Immutable.Map(), action) {
  let newState;
  switch (action.type) {
    
  case SUCCESS_getUniverse:
    return state.set(action.payload.id, fromJSGreedy(action.payload));

  case SUCCESS_getUniverses:
    newState = state;
    action.payload.forEach(universe => {
      if (!newState.get(universe.id)) newState = newState.set(universe.id, fromJSGreedy(universe));
    });
    return newState;
    
  case SUCCESS_getInventory:
    const d = new Date();
    return state.setIn([action.params, 'lastInventoryUpdate'], d.getTime());
  
  default:
    return state;
  }
}

export function chats(state = Immutable.Map(), action) {
  switch (action.type) {
    
  case SUCCESS_getChat:
    return state.set(action.payload.id, fromJSGreedy(action.payload));
    
  default:
    return state;
  }
}

export function topics(state = Immutable.Map(), action) {
  let newState;
  switch (action.type) {
    
  case SUCCESS_getInventory:
    newState = state;
    action.payload.forEach(topic => newState = newState.set(topic.id, fromJSGreedy(topic)));
    return newState;
    
  case SUCCESS_getTopic:
    return state.set(action.payload.id, fromJSGreedy(action.payload));
    
  
  case SUCCESS_getTopicContent:
    return state.setIn([action.params, 'content'], fromJSGreedy(action.payload));
    
  default:
    return state;
  }
}

export function users(state = Immutable.Map(), action) {
  let newState;
  switch (action.type) {
    
  case SUCCESS_postUser:
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
