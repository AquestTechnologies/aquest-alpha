// import { Store } from 'flummox';
import BaseStore from '../utils/BaseStore.js';

class TopicStore extends BaseStore {
  
  constructor(flux) {
    super(); // Don't forget this step

    const topicActionIds = flux.getActionIds('topic');
    //this.register(universeActionIds.createMessage, this.handleNewMessage);

    this.state = {
      //messages: [],
    };
  }

  getAllTopics(universe) { 
    //async fetch 
    return [];
  }

}

export default TopicStore;