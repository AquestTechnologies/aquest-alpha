import BaseActions from '../utils/BaseActions.js';

export default class ChatActions extends BaseActions {
  
  // Pour info doc Flummox : 
  // [Dans une action] The return value is then sent through the dispatcher automatically. (If you return undefined, Flummox skips the dispatch step.)
  
  async loadChat(chatId) {
    console.log('.A. ChatActions.loadChat ' + chatId);
    try {
      return await this.fetch.chat(chatId);
    } catch (err) {
      console.log('!!! Error while ChatActions.loadChat.');
      console.log(err);
    }
  }
  
  flushChat() {
    console.log('.A. ChatActions.flushChat');
    return true;
  }
  
}