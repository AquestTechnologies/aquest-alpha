import log from '../utils/logTailor.js';
import { 
  LOAD_CHAT_REQUEST,
  LOAD_CHAT_SUCCESS,
  LOAD_CHAT_FAILURE
} from '../constants/ActionTypes';

const initialState = {
  chat: {},
  chatIsLoading: false
};

export default function chat(state = initialState, action) {
  switch (action.type) {
  case LOAD_CHAT_REQUEST:
    log('.R. LOAD_CHAT_REQUEST ' + action);
    return {
      chat: state.chat,
      chatIsLoading: true
    };
  case LOAD_CHAT_SUCCESS:
    log('.R. LOAD_CHAT_SUCCESS ' + action);
    return {
      chat: action.result,
      chatIsLoading: false,
    };
  default:
    return state;
  }
}
