import log from './utils/logTailor';
import Immutable from 'immutable';
import {routerStateReducer} from 'redux-react-router';


export function router(state = {}, action) {
  log('.R. ' + action.type); // Cette ligne dans le premier reducer
  return routerStateReducer(state, action);
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

// Doit être exporté en dernier pour activer les side effects après la reduction des précédants
export function records(state = [], action) {
  return [
    ...state,
    {action: action, date: new Date()}
  ];
}

// From the Immutable.js Github wiki
function fromJSGreedy(js) {
  return typeof js !== 'object' || js === null ? js :
    Array.isArray(js) ? 
      Immutable.Seq(js).map(fromJSGreedy).toList() :
      Immutable.Seq(js).map(fromJSGreedy).toMap();
}
