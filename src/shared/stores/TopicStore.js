import BaseStore from '../utils/BaseStore.js';

export default class TopicStore extends BaseStore {
  
  constructor(flux) {
    super(); // Don't forget this step

    const topicActionIds = flux.getActionIds('topicActions');
    this.registerAsync(topicActionIds.loadCurrentTopics, this.handleBeginAsyncRequest, this.handleLoadCurrentTopics, this.handleErrorAsyncRequest);
    // this.register(universeActionIds.syncAction, this.syncAction);

    this.state = {}; // Reset le state, important (?)
    console.log('.S. TopicStore initialized');
  }

  // Les getters servent principalement à FluxComponent.connectToStores
  // ils fetch le state flux pour qu'il soit injecté dans le state React
  getCurrentTopics() {
    console.log('.S. TopicStore.getCurrentTopics');
    return this.state.currentTopics;
  }
  
  // Les handlers correspondent au traitement du state après avoir executé une action
  handleLoadCurrentTopics(topics) { 
    console.log('.S. TopicStore.handleLoadCurrentTopics');
    this.setState({
      currentTopics: topics,
      isLoading: false
    });
  }

}