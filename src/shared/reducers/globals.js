import log from '../utils/logTailor';
import { 
  SET_UNIVERSE,
  SUCCESS_UNIVERSE,
  SET_TOPIC
} from '../constants/ActionTypes';

export default function globals(state = {}, action) {
  switch (action.type) {
    
  case SET_UNIVERSE:
    return {
      userId:     state.userId,
      chatId:     action.result.chatId,
      topicId:    state.topicId,
      universeId: action.result.id,
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
