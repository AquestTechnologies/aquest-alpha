// import { Store } from 'flummox';
import BaseStore from '../utils/BaseStore.js';

class TopicStore extends BaseStore {
  
  constructor(flux) {
    super(); // Don't forget this step

    const topicActionIds = flux.getActionIds('topicActions');
    this.registerAsync(topicActionIds.loadCurrentTopics, this.handleBeginAsyncRequest, this.handleLoadCurrentTopics, this.handleErrorAsyncRequest);
    //this.register(universeActionIds.createMessage, this.handleNewMessage);

    this.state = {
      //messages: [],
    };
    console.log('.S. TopicStore initialized');
  }

  handleLoadCurrentTopics(topics) { 
    console.log('.S. TopicStore handleLoadCurrentTopics');
    this.setState({
      currentTopics: topics,
      isLoading: false
    });
  }
  
  getCurrentTopics() {
    return this.state.currentTopics;
  }

}

export default TopicStore;