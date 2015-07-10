import log from './utils/logTailor';
import Immutable from 'immutable';
import { 
  SET_UNIVERSE, SET_TOPIC,
  REQUEST_UNIVERSE, SUCCESS_UNIVERSE, FAILURE_UNIVERSE,
  REQUEST_UNIVERSES, SUCCESS_UNIVERSES, FAILURE_UNIVERSES,
  REQUEST_INVENTORY, SUCCESS_INVENTORY, FAILURE_INVENTORY,
  REQUEST_TOPIC_CONTENT, SUCCESS_TOPIC_CONTENT, FAILURE_TOPIC_CONTENT,
  REQUEST_TOPIC, SUCCESS_TOPIC, FAILURE_TOPIC,
  REQUEST_CHAT, SUCCESS_CHAT, FAILURE_CHAT
} from './actionsTypes';


export function universes(state = Immutable.Map(), action) {
  let newState;
  switch (action.type) {
    
  case SUCCESS_UNIVERSE:
    return state.set(action.payload.id, Immutable.fromJS(action.payload));

  case SUCCESS_UNIVERSES:
    newState = state;
    action.payload.forEach(universe => newState = newState.set(universe.id, Immutable.fromJS(universe)));
    return newState;
  
  default:
    return state;
  }
}

export function chats(state = Immutable.Map(), action) {
  switch (action.type) {
    
  case SUCCESS_CHAT:
    return state.set(action.payload.id, Immutable.fromJS(action.payload));
    
  default:
    return state;
  }
}

export function topics(state = Immutable.Map(), action) {
  let newState;
  switch (action.type) {
    
  case SUCCESS_INVENTORY:
    newState = state;
    action.payload.forEach(topic => newState = newState.set(topic.id, Immutable.fromJS(topic)));
    return newState;
    
  case SUCCESS_TOPIC:
    return state.set(action.payload.id, Immutable.fromJS(action.payload));
    
  
  case SUCCESS_TOPIC_CONTENT:
    return state.updateIn([action.params, 'content'], Immutable.fromJS(action.payload));
    
  default:
    return state;
  }
}

export function records(state = [], action) {
  log('.R. ' + action.type);
  // log(action);
  return [
    ...state,
    {
      action: action,
      date: new Date()
    }
  ];
}

/*export function globals(state = {}, action) {
  switch (action.type) {
  
  case SET_UNIVERSE:
    return {
      userId:     state.userId,
      chatId:     action.payload.chatId,
      topicId:    state.topicId,
      universeId: action.payload.id,
    };
    
  case SET_TOPIC:
    return {
      userId:     state.userId,
      chatId:     action.payload.chatId,
      topicId:    action.payload.id,
      universeId: state.universeId,
    };
    
  case SUCCESS_UNIVERSE:
    return {
      userId:     state.userId,
      chatId:     action.payload.chatId,
      topicId:    state.topicId,
      universeId: action.payload.id,
    };
    
  default:
    return state;
  }
}*/
