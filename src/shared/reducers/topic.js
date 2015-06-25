import log from '../utils/logTailor.js';
import { 
  LOAD_INVENTORY_REQUEST,
  LOAD_INVENTORY_SUCCESS,
  LOAD_INVENTORY_FAILURE,
  LOAD_TOPIC_CONTENT_REQUEST,
  LOAD_TOPIC_CONTENT_SUCCESS,
  LOAD_TOPIC_CONTENT_FAILURE,
  LOAD_TOPIC_BY_HANDLE_REQUEST,
  LOAD_TOPIC_BY_HANDLE_SUCCESS,
  LOAD_TOPIC_BY_HANDLE_FAILURE,
  SET_TOPIC
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
    
  case LOAD_INVENTORY_REQUEST:
    log('.R. LOAD_INVENTORY_REQUEST');
    return {
      topic: state.topic,
      inventory: state.inventory,
      topicIsLoading: state.topicIsLoading,
      inventoryIsLoading: true
    };
    
  case LOAD_INVENTORY_SUCCESS:
    log('.R. LOAD_INVENTORY_SUCCESS');
    return {
      topic: state.topic,
      inventory: action.result,
      topicIsLoading: state.topicIsLoading,
      inventoryIsLoading: false
    };
    
  case LOAD_TOPIC_CONTENT_REQUEST:
    log('.R. LOAD_TOPIC_CONTENT_REQUEST');
    return {
      topic: state.topic,
      inventory: state.inventory,
      topicIsLoading: true,
      inventoryIsLoading: state.inventoryIsLoading
    };
    
  case LOAD_TOPIC_CONTENT_SUCCESS:
    log('.R. LOAD_TOPIC_CONTENT_SUCCESS');
    let topic = state.topic;
    topic.content = action.result;
    return {
      topic: topic,
      inventory: state.inventory,
      topicIsLoading: false,
      inventoryIsLoading: state.inventoryIsLoading
    };
    
  case LOAD_TOPIC_BY_HANDLE_REQUEST:
    log('.R. LOAD_TOPIC_BY_HANDLE_REQUEST');
    return {
      topic: state.topic,
      inventory: state.inventory,
      topicIsLoading: true,
      inventoryIsLoading: state.inventoryIsLoading
    };
    
  case LOAD_TOPIC_BY_HANDLE_SUCCESS:
    log('.R. LOAD_TOPIC_BY_HANDLE_SUCCESS');
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
