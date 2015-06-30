import log from '../utils/logTailor';
import { 
  SUCCESS_CHAT,
  FAILURE_CHAT
} from '../constants/ActionTypes';

const initialState = {
  chat: {}
};

export default function chats(state = initialState, action) {
  switch (action.type) {
  case SUCCESS_CHAT:
    return {
      chat: action.result
    };
  default:
    return state;
  }
}
