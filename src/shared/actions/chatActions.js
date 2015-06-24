import { fetchChat } from '../utils/fetchers.js'
import log from '../utils/logTailor.js';
import { 
  LOAD_CHAT_REQUEST,
  LOAD_CHAT_SUCCESS,
  LOAD_CHAT_FAILURE
} from '../constants/ActionTypes';



export function loadChat(chatId) {
  log('.A. loadChat : ' + chatId);
  return {
    types: [LOAD_CHAT_REQUEST, LOAD_CHAT_SUCCESS, LOAD_CHAT_FAILURE],
    promise: fetchChat(chatId),
    data: chatId
  };
}
