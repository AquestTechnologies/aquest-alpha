import BaseActions from '../utils/BaseActions.js';

export default class TopicActions extends BaseActions {
  
  // Pour info doc Flummox : 
  // [Dans une action] The return value is then sent through the dispatcher automatically. (If you return undefined, Flummox skips the dispatch step.)
  
  loadInventory(universeId) {
    console.log('.A. TopicActions.loadInventory');
    let fetch = this.fetch;
    return new Promise(function(resolve, reject) {
      fetch.topics(universeId).then(function(data) {
        resolve({universeId: universeId, topics: data});
      });
    });
  }
  
  loadTopicByHandle(handle) {
    console.log('.A. TopicActions.loadTopicByHandle');
    let fetch = this.fetch;
    return new Promise(function(resolve, reject) {
      fetch.topicByHandle(handle).then(function(data) {
        resolve(data);
      });
    });
  }
  
  loadTopicContent(id) {
    console.log('.A. TopicActions.loadTopicContent');
    let fetch = this.fetch;
    return new Promise(function(resolve, reject) {
      fetch.topicContent(id).then(function(data) {
        resolve(data);
      });
    });
  }
  
  setTopic(topic) {
    console.log('.A. TopicActions.setTopic');
    return topic;
  }

}