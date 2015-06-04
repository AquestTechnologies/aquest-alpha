import BaseActions from '../utils/BaseActions.js';

class UniverseActions extends BaseActions {
  
  switchUniverse(id) {
    return id;
  }
  
  async getStartUniverse(userId) {
    console.log('... UniverseActions.getStartUniverse');
    
    return await this.fetch.startUniverse();
   /* try {
      return await IsoFetch.startUniverse();
    } catch (error) {
      // handle error somehow
    }*/
  }
  
  /*async createMessage(messageContent) {
    try {
      return await serverCreateMessage(messageContent);
    } catch (error) {
      // handle error somehow
    }
  }*/
  
  //The return value is then sent through the dispatcher automatically. (If you return undefined, Flummox skips the dispatch step.)

}

export default UniverseActions;