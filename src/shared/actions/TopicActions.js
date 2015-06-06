import BaseActions from '../utils/BaseActions.js';

export default class TopicActions extends BaseActions {
  
  // Pour info doc Flummox : 
  // [Dans une action] The return value is then sent through the dispatcher automatically. (If you return undefined, Flummox skips the dispatch step.)
  
  async loadCurrentTopics(universeId) {
    console.log('.A. TopicActions.loadCurrentTopics');
    try {
      return await this.fetch.currentTopics(universeId);
    } catch (err) {
      console.log('!!! Error while UniverseActions.loadCurrentTopics.');
      console.log(err);
    }
  }

}