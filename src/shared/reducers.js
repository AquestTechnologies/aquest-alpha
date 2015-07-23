import log from './utils/logTailor';
import Immutable from 'immutable';

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
    
  case 'SUCCESS_READ_UNIVERSE':
    return state.set(action.payload.id, fromJSGreedy(action.payload));

  case 'SUCCESS_READ_UNIVERSES':
    newState = state;
    action.payload.forEach(universe => {
      if (!newState.get(universe.id)) newState = newState.set(universe.id, fromJSGreedy(universe));
    });
    return newState;
    
  case 'SUCCESS_READ_INVENTORY':
    const d = new Date();
    return state.setIn([action.params, 'lastInventoryUpdate'], d.getTime());
  
  default:
    return state;
  }
}

export function chats(state = Immutable.Map(), action) {
  switch (action.type) {
    
  case 'SUCCESS_READ_CHAT':
    return state.set(action.payload.id, fromJSGreedy(action.payload));
    
  default:
    return state;
  }
}

export function topics(state = Immutable.Map(), action) {
  let newState;
  switch (action.type) {
    
  case 'SUCCESS_READ_INVENTORY':
    newState = state;
    action.payload.forEach(topic => newState = newState.set(topic.id, fromJSGreedy(topic)));
    return newState;
    
  case 'SUCCESS_READ_TOPIC':
    return state.set(action.payload.id, fromJSGreedy(action.payload));
    
  case 'SUCCESS_READ_TOPIC_CONTENT':
    return state.setIn([action.params, 'content'], fromJSGreedy(action.payload));
    
  case 'SUCCESS_CREATE_TOPIC':
    return state.set(action.params.id, fromJSGreedy(action.params));
    
  default:
    return state;
  }
}

export function users(state = Immutable.Map(), action) {
  switch (action.type) {
    
  case 'SUCCESS_CREATE_USER':
    return state.set(action.payload.id, fromJSGreedy(action.payload));
    
  case 'SUCCESS_LOGIN':
    return state.set(action.payload.id, fromJSGreedy(action.payload)); // le token est dedans !
    
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
