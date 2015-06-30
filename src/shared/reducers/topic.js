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

const initialState = {
  inventoryIsLoading: false,
  topicIsLoading: false
};

export default function chat(state = initialState, action) {
  switch (action.type) {
    
  case SET_TOPIC:
    log('.R. SET_TOPIC');
    return {
      topic: action.data,
      inventory: state.inventory,
      topicIsLoading: state.topicIsLoading,
      inventoryIsLoading: state.inventoryIsLoading
    };
    
  case REQUEST_INVENTORY:
    log('.R. REQUEST_INVENTORY');
    return {
      topic: state.topic,
      inventory: state.inventory,
      topicIsLoading: state.topicIsLoading,
      inventoryIsLoading: true
    };
    
  case SUCCESS_INVENTORY:
    log('.R. SUCCESS_INVENTORY');
    return {
      topic: state.topic,
      inventory: action.result,
      topicIsLoading: state.topicIsLoading,
      inventoryIsLoading: false
    };
    
  case REQUEST_TOPIC_CONTENT:
    log('.R. REQUEST_TOPIC_CONTENT');
    return {
      topic: state.topic,
      inventory: state.inventory,
      topicIsLoading: true,
      inventoryIsLoading: state.inventoryIsLoading
    };
    
  case SUCCESS_TOPIC_CONTENT:
    log('.R. SUCCESS_TOPIC_CONTENT');
    let topic = state.topic;
    topic.content = action.result;
    return {
      topic: topic,
      inventory: state.inventory,
      topicIsLoading: false,
      inventoryIsLoading: state.inventoryIsLoading
    };
    
  case REQUEST_TOPIC_BY_HANDLE:
    log('.R. REQUEST_TOPIC_BY_HANDLE');
    return {
      topic: state.topic,
      inventory: state.inventory,
      topicIsLoading: true,
      inventoryIsLoading: state.inventoryIsLoading
    };
    
  case SUCCESS_TOPIC_BY_HANDLE:
    log('.R. SUCCESS_TOPIC_BY_HANDLE');
    return {
      topic: action.result,
      inventory: state.inventory,
      topicIsLoading: false,
      inventoryIsLoading: state.inventoryIsLoading
    };
    
  default:
    return state;
  }
}
