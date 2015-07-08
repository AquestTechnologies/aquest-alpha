import log from './utils/logTailor';
import Immutable from 'immutable';
import { 
  SET_UNIVERSE, SET_TOPIC,
  REQUEST_UNIVERSE, SUCCESS_UNIVERSE, FAILURE_UNIVERSE,
  REQUEST_UNIVERSES, SUCCESS_UNIVERSES, FAILURE_UNIVERSES,
  REQUEST_INVENTORY, SUCCESS_INVENTORY, FAILURE_INVENTORY,
  REQUEST_TOPIC_CONTENT, SUCCESS_TOPIC_CONTENT, FAILURE_TOPIC_CONTENT,
  REQUEST_TOPIC_BY_HANDLE, SUCCESS_TOPIC_BY_HANDLE, FAILURE_TOPIC_BY_HANDLE,
  REQUEST_CHAT, SUCCESS_CHAT, FAILURE_CHAT
} from './actionsTypes';

export function globals(state = {}, action) {
  switch (action.type) {
    
  case SET_UNIVERSE:
    return {
      userId:     state.userId,
      chatId:     action.params.chatId,
      topicId:    state.topicId,
      universeId: action.params.id,
    };
    
  case SUCCESS_UNIVERSE:
    return {
      userId:     state.userId,
      chatId:     action.result.chatId,
      topicId:    state.topicId,
      universeId: action.result.id,
    };
    
  case SET_TOPIC:
    return {
      userId:     state.userId,
      chatId:     state.chatId,
      topicId:    action.result.id,
      universeId: state.universeId,
    };
    
  default:
    return state;
  }
}

export function universes(state = Immutable.Map(), action) {
  let newState;
  switch (action.type) {
    
    case SUCCESS_UNIVERSE:
      // newState = simpleCopy(state);
      // newState[action.result.id] = action.result;
      action.result.topics = [];
      return state.set(action.result.id, Immutable.fromJS(action.result));
  
    case SUCCESS_UNIVERSES:
      // newState = simpleCopy(state);
      // action.result.forEach(universe => newState[universe.id] = universe);
      newState = state;
      action.result.forEach(universe => {
        universe.topics = newState.get(universe.id) === undefined ? [] : newState.getIn([universe.id, 'topics']);
        newState = newState.set(universe.id, Immutable.fromJS(universe));
      });
      return newState;
    
    case SUCCESS_INVENTORY:
      // newState = simpleCopy(state);
      // action.result.forEach(topic => newState[topic.id] = topic);
      newState = state;
      action.result.forEach(topic => newState = newState.updateIn([action.params, 'topics'], topics => topics.push(Immutable.fromJS(topic))));
      return newState;
    
    default:
      return state;
  }
}

export function chats(state = Immutable.Map(), action) {
  let newState;
  switch (action.type) {
    
    case SUCCESS_CHAT:
      // newState = simpleCopy(state);
      // newState[action.result.id] = action.result;
      return state.set(action.result.id, Immutable.fromJS(action.result));;
      
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

