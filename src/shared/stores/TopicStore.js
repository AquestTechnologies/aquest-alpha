import BaseStore from '../utils/BaseStore.js';

export default class TopicStore extends BaseStore {
  
  constructor(flux) {
    super(); // Don't forget this step

    const topicActionIds = flux.getActionIds('topicActions');
    this.registerAsync(topicActionIds.loadInventory, this.handleBeginAsyncRequest, this.handleLoadInventory, this.handleErrorAsyncRequest);
    this.registerAsync(topicActionIds.loadTopicContent, this.handleBeginAsyncRequest, this.handleLoadTopicContent, this.handleErrorAsyncRequest);
    this.registerAsync(topicActionIds.loadTopicByHandle, this.handleBeginAsyncRequest, this.handleLoadTopic, this.handleErrorAsyncRequest);
    this.register(topicActionIds.setTopic, this.handleLoadTopic);
    
    this.state = {}; // Reset le state, important (?)
    console.log('.S. TopicStore initialized');
  }

  // Les getters servent principalement à FluxComponent.connectToStores
  // ils fetch le state flux pour qu'il soit injecté dans le state React
  getInventory() {
    // console.log('.S. TopicStore.getTopics');
    return this.state.inventory;
  }
  
  getTopic() {
    // console.log('.S. TopicStore.getTopics');
    return this.state.topic;
  }
  
  // Les handlers correspondent au traitement du state après avoir executé une action
  handleLoadInventory(inventory) { 
    console.log('.S. TopicStore.handleLoadInventory');
    this.setState({
      inventory: inventory,
      isLoading: false
    });
  }
  
  handleLoadTopic(topic) {
    console.log('.S. TopicStore.handleLoadTopic');
    this.setState({
      topic: topic,
      isLoading: false
    });
  }
  
  handleLoadTopicContent(content) {
    console.log('.S. TopicStore.handleLoadTopicContent');
    let topic = this.state.topic;
    topic.content = content;
    this.setState({
      topic: topic,
      isLoading: false
    });
  }
  
}