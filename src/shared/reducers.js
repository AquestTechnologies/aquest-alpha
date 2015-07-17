import log from './utils/logTailor';
import Immutable from 'immutable';
import { 
  SET_UNIVERSE, SET_TOPIC,
  REQUEST_UNIVERSE, SUCCESS_UNIVERSE, FAILURE_UNIVERSE,
  REQUEST_UNIVERSES, SUCCESS_UNIVERSES, FAILURE_UNIVERSES,
  REQUEST_INVENTORY, SUCCESS_INVENTORY, FAILURE_INVENTORY,
  REQUEST_TOPIC_CONTENT, SUCCESS_TOPIC_CONTENT, FAILURE_TOPIC_CONTENT,
  REQUEST_TOPIC, SUCCESS_TOPIC, FAILURE_TOPIC,
  REQUEST_CHAT, SUCCESS_CHAT, FAILURE_CHAT,
  REQUEST_CREATE_USER, SUCCESS_CREATE_USER, FAILURE_CREATE_USER
} from './actionsTypes';

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
    
  case SUCCESS_UNIVERSE:
    return state.set(action.payload.id, fromJSGreedy(action.payload));

  case SUCCESS_UNIVERSES:
    newState = state;
    action.payload.forEach(universe => {
      //Tout ça va changer de toutes façons
      if (!newState.get(universe.id)) newState = newState.set(universe.id, fromJSGreedy(universe));
    });
    return newState;
    
  case SUCCESS_INVENTORY:
    const d = new Date();
    return state.setIn([action.params, 'lastInventoryUpdate'], d.getTime());
  
  default:
    return state;
  }
}

export function chats(state = Immutable.Map(), action) {
  switch (action.type) {
    
  case SUCCESS_CHAT:
    return state.set(action.payload.id, fromJSGreedy(action.payload));
    
  default:
    return state;
  }
}

export function topics(state = Immutable.Map(), action) {
  let newState;
  switch (action.type) {
    
  case SUCCESS_INVENTORY:
    newState = state;
    action.payload.forEach(topic => newState = newState.set(topic.id, fromJSGreedy(topic)));
    return newState;
    
  case SUCCESS_TOPIC:
    return state.set(action.payload.id, fromJSGreedy(action.payload));
    
  
  case SUCCESS_TOPIC_CONTENT:
    return state.setIn([action.params, 'content'], fromJSGreedy(action.payload));
    
  default:
    return state;
  }
}

export function users(state = Immutable.Map(), action) {
  let newState;
  switch (action.type) {
    
  case SUCCESS_CREATE_USER:
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
