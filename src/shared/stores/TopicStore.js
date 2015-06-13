import BaseStore from '../utils/BaseStore.js';

export default class TopicStore extends BaseStore {
  
  constructor(flux) {
    super(); // Don't forget this step

    const topicActionIds = flux.getActionIds('topicActions');
    this.registerAsync(topicActionIds.loadInventory, this.handleBeginAsyncRequest, this.handleLoadInventory, this.handleErrorAsyncRequest);
    this.register(topicActionIds.flushInventory, this.handleFlushInventory);

    this.state = {}; // Reset le state, important (?)
    console.log('.S. TopicStore initialized');
  }

  // Les getters servent principalement à FluxComponent.connectToStores
  // ils fetch le state flux pour qu'il soit injecté dans le state React
  getInventory() {
    console.log('.S. TopicStore.getTopics');
    return this.state.inventory;
  }
  
  // Les handlers correspondent au traitement du state après avoir executé une action
  handleLoadInventory(inventory) { 
    console.log('.S. TopicStore.handleLoadInventory');
    this.setState({
      inventory: inventory,
      isLoading: false
    });
  }
  
  handleFlushInventory() {
    console.log('.S. TopicStore.handleFlushInventory');
    let inventory = this.state.inventory;
    inventory.topics = [];
    this.setState({
      inventory: inventory
    });
  }

}