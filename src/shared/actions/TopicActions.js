import BaseActions from '../utils/BaseActions.js';

export default class TopicActions extends BaseActions {
  
  // Pour info doc Flummox : 
  // [Dans une action] The return value is then sent through the dispatcher automatically. (If you return undefined, Flummox skips the dispatch step.)
  
  async loadInventory(universeId) {
    console.log('.A. TopicActions.loadInventory');
    try {
      return {universeId: universeId, topics: await this.fetch.topics(universeId)};
    } catch (err) {
      console.log('!!! Error while UniverseActions.loadTopics.');
      console.log(err);
    }
  }
  
  flushInventory() {
    console.log('.A. TopicActions.flushInventory');
    return true;
  }

}