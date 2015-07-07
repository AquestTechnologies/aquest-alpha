import log from '../utils/logTailor';
import { 
  SUCCESS_CHAT,
  FAILURE_CHAT
} from '../constants/ActionTypes';
import simpleCopy from '../utils/simpleCopy';

export default function chats(state = {}, action) {
  let newState;
  switch (action.type) {
    
    case SUCCESS_CHAT:
      newState = simpleCopy(state);
      newState[action.result.id] = action.result;
      return newState;
      
    default:
      return state;
  }
}
