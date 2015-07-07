import log from '../utils/logTailor';
import { 
  REQUEST_INVENTORY,
  SUCCESS_INVENTORY,
  FAILURE_INVENTORY,
  REQUEST_TOPIC_CONTENT,
  SUCCESS_TOPIC_CONTENT,
  FAILURE_TOPIC_CONTENT,
  REQUEST_TOPIC_BY_HANDLE,
  SUCCESS_TOPIC_BY_HANDLE,
  FAILURE_TOPIC_BY_HANDLE
} from '../constants/ActionTypes';
import simpleCopy from '../utils/simpleCopy';

export default function topics(state = {}, action) {
  let newState;
  switch (action.type) {
    
    case SUCCESS_INVENTORY:
      newState = simpleCopy(state);
      action.result.forEach(topic => newState[topic.id] = topic);
      return newState;
      
    // case SUCCESS_TOPIC_CONTENT:
    //   let topic = state.topic;
    //   topic.content = action.result;
    //   return {
    //     topic: topic,
    //     inventory: state.inventory
    //   };
      
    // case SUCCESS_TOPIC_BY_HANDLE:
    //   return {
    //     topic: action.result,
    //     inventory: state.inventory
    //   };
      
    default:
      return state;
  }
}
