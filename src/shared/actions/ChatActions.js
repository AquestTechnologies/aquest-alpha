import BaseActions from '../utils/BaseActions.js';

export default class ChatActions extends BaseActions {
  
  // Pour info doc Flummox : 
  // [Dans une action] The return value is then sent through the dispatcher automatically. (If you return undefined, Flummox skips the dispatch step.)
  
  loadChat(chatId) {
    console.log('.A. ChatActions.loadChat ' + chatId);
    let fetch = this.fetch;
    return new Promise(function(resolve, reject) {
      fetch.chat(chatId).then(function(data) {
        resolve(data);
      });
    });
  }
  
  flushChat() {
    console.log('.A. ChatActions.flushChat');
    return true;
  }
  
}