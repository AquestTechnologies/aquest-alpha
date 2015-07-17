import log from './utils/logTailor';
import Immutable from 'immutable';
import { 
  REQUEST_READ_UNIVERSE, SUCCESS_READ_UNIVERSE, FAILURE_READ_UNIVERSE,
  REQUEST_READ_UNIVERSES, SUCCESS_READ_UNIVERSES, FAILURE_READ_UNIVERSES,
  REQUEST_READ_INVENTORY, SUCCESS_READ_INVENTORY, FAILURE_READ_INVENTORY,
  REQUEST_READ_TOPIC_CONTENT, SUCCESS_READ_TOPIC_CONTENT, FAILURE_READ_TOPIC_CONTENT,
  REQUEST_READ_TOPIC, SUCCESS_READ_TOPIC, FAILURE_READ_TOPIC,
  REQUEST_READ_CHAT, SUCCESS_READ_CHAT, FAILURE_READ_CHAT,
  REQUEST_CREATE_UNIVERSE, SUCCESS_CREATE_UNIVERSE, FAILURE_CREATE_UNIVERSE,
  REQUEST_CREATE_TOPIC, SUCCESS_CREATE_TOPIC, FAILURE_CREATE_TOPIC,
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
    
  case SUCCESS_READ_UNIVERSE:
    return state.set(action.payload.id, fromJSGreedy(action.payload));

  case SUCCESS_READ_UNIVERSES:
    newState = state;
    action.payload.forEach(universe => {
      if (!newState.get(universe.id)) newState = newState.set(universe.id, fromJSGreedy(universe));
    });
    return newState;
    
  case SUCCESS_READ_INVENTORY:
    const d = new Date();
    return state.setIn([action.params, 'lastInventoryUpdate'], d.getTime());
  
  default:
    return state;
  }
}

export function chats(state = Immutable.Map(), action) {
  switch (action.type) {
    
  case SUCCESS_READ_CHAT:
    return state.set(action.payload.id, fromJSGreedy(action.payload));
    
  default:
    return state;
  }
}

export function topics(state = Immutable.Map(), action) {
  let newState;
  switch (action.type) {
    
  case SUCCESS_READ_INVENTORY:
    newState = state;
    action.payload.forEach(topic => newState = newState.set(topic.id, fromJSGreedy(topic)));
    return newState;
    
  case SUCCESS_READ_TOPIC:
    return state.set(action.payload.id, fromJSGreedy(action.payload));
    
  
  case SUCCESS_READ_TOPIC_CONTENT:
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
