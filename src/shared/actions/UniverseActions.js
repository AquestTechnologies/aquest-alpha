import BaseActions from '../utils/BaseActions.js';

class UniverseActions extends BaseActions {
  
  async loadUniverse(universeId) {
    console.log('.A. UniverseActions.loadUniverse ' + universeId);
    try {
      return await this.fetch.universe(universeId);
    } catch (error) {
      // handle error somehow
    }
  }
  
  async loadStartUniverse(userId) {
    console.log('.A. UniverseActions.LoadStartUniverse ' + userId);
    try {
      return await this.fetch.startUniverse();
    } catch (error) {
      // handle error somehow
    }
  }
  
  async loadAllUniverses() {
    console.log('.A. UniverseActions.loadAllUniverses');
    try {
      return await this.fetch.allUniverses();
    } catch (error) {
      // handle error somehow
    }
  }
  
  //The return value is then sent through the dispatcher automatically. (If you return undefined, Flummox skips the dispatch step.)

}

export default UniverseActions;