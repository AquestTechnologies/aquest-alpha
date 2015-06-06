import BaseActions from '../utils/BaseActions.js';

class TopicActions extends BaseActions {
  
  async loadCurrentTopics(universeId) {
    console.log('... TopicActions.loadCurrentTopics');
    try {
      return await this.fetch.currentTopics(universeId);
    } catch (error) {
      // handle error somehow
    }
  }
  
  //The return value is then sent through the dispatcher automatically. (If you return undefined, Flummox skips the dispatch step.)

}

export default TopicActions;