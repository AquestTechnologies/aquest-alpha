import { fetchChat } from '../utils/fetchers';
import log from '../utils/logTailor';
import { 
  REQUEST_CHAT,
  SUCCESS_CHAT,
  FAILURE_CHAT
} from '../constants/ActionTypes';



export function loadChat(chatId) {
  log('.A. loadChat : ' + chatId);
  return {
    types: [REQUEST_CHAT, SUCCESS_CHAT, FAILURE_CHAT],
    promise: fetchChat(chatId),
    params: chatId
  };
}
