import BaseActions from '../utils/BaseActions.js';

class UniverseActions extends BaseActions {
  
  switchUniverse(id) {
    return id;
  }
  
  async loadStartUniverse(userId) {
    console.log('... UniverseActions.LoadStartUniverse');
    try {
      return await this.fetch.startUniverse();
    } catch (error) {
      // handle error somehow
    }
  }
  
  //The return value is then sent through the dispatcher automatically. (If you return undefined, Flummox skips the dispatch step.)

}

export default UniverseActions;