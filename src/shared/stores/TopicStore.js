import BaseStore from '../utils/BaseStore.js';

export default class TopicStore extends BaseStore {
  
  constructor(flux) {
    super(); // Don't forget this step

    const topicActionIds = flux.getActionIds('topicActions');
    this.registerAsync(topicActionIds.loadTopics, this.handleBeginAsyncRequest, this.handleLoadTopics, this.handleErrorAsyncRequest);
    // this.register(universeActionIds.syncAction, this.syncAction);

    this.state = {}; // Reset le state, important (?)
    console.log('.S. TopicStore initialized');
  }

  // Les getters servent principalement à FluxComponent.connectToStores
  // ils fetch le state flux pour qu'il soit injecté dans le state React
  getTopics() {
    console.log('.S. TopicStore.getTopics');
    return this.state.topics;
  }
  
  // Les handlers correspondent au traitement du state après avoir executé une action
  handleLoadTopics(topics) { 
    console.log('.S. TopicStore.handleLoadTopics');
    this.setState({
      topics: topics,
      isLoading: false
    });
  }

}