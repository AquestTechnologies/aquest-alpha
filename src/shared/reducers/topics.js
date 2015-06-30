import log from '../utils/logTailor';
import { 
  SET_TOPIC,
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


export default function chat(state = {}, action) {
  switch (action.type) {
    
  case SET_TOPIC:
    return {
      topic: action.data,
      inventory: state.inventory
    };
    
  case SUCCESS_INVENTORY:
    return {
      topic: state.topic,
      inventory: action.result
    };
    
  case SUCCESS_TOPIC_CONTENT:
    let topic = state.topic;
    topic.content = action.result;
    return {
      topic: topic,
      inventory: state.inventory
    };
    
  case SUCCESS_TOPIC_BY_HANDLE:
    return {
      topic: action.result,
      inventory: state.inventory
    };
    
  default:
    return state;
  }
}
