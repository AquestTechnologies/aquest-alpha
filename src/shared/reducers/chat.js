import log from '../utils/logTailor';
import { 
  REQUEST_CHAT,
  SUCCESS_CHAT,
  FAILURE_CHAT
} from '../constants/ActionTypes';

const initialState = {
  chat: {},
  chatIsLoading: false
};

export default function chat(state = initialState, action) {
  switch (action.type) {
  case REQUEST_CHAT:
    log('.R. REQUEST_CHAT');
    return {
      chat: state.chat,
      chatIsLoading: true
    };
  case SUCCESS_CHAT:
    log('.R. SUCCESS_CHAT');
    return {
      chat: action.result,
      chatIsLoading: false,
    };
  default:
    return state;
  }
}
