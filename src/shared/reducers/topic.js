import log from '../utils/logTailor.js';
import { 
  LOAD_INVENTORY_REQUEST,
  LOAD_INVENTORY_SUCCESS,
  LOAD_INVENTORY_FAILURE,
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
    log('.R. LOAD_INVENTORY_REQUEST ' + action);
    return {
      topic: state.topic,
      inventory: state.inventory,
      topicIsLoading: state.topicIsLoading,
      inventoryIsLoading: true
    };
  case LOAD_INVENTORY_SUCCESS:
    log('.R. LOAD_INVENTORY_SUCCESS ' + action);
    return {
      topic: state.topic,
      inventory: action.result,
      topicIsLoading: state.topicIsLoading,
      inventoryIsLoading: false
    };
  default:
    return state;
  }
}
