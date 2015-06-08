import BaseStore from '../utils/BaseStore.js';

export default class ChatStore extends BaseStore {
  
  constructor(flux) {
    super();

    const chatActionIds = flux.getActionIds('chatActions');
    this.registerAsync(chatActionIds.loadChat, this.handleBeginAsyncRequest, this.handleLoadChat, this.handleErrorAsyncRequest);
    // this.register(chatActionIds.syncAction, this.syncAction);
    
    this.state = {}; // Reset le state, important (?)
    console.log('.S. ChatStore initialized');
  }
  
  // Les getters servent principalement à FluxComponent.connectToStores
  // ils fetch le state flux pour qu'il soit injecté dans le state React
  getChat() {
    console.log('.S. ChatStore.getChat');
    return this.state.chat;
  }
    
  // Les handlers correspondent au traitement du state après avoir executé une action
  handleLoadChat(chat) {
    this.setState({
      chat: chat,
      isLoading: false
    });
    console.log('.S. ChatStore.handleLoadChat set ' + chat.name);
  }
  
}