import BaseActions from '../utils/BaseActions.js';

export default class UniverseActions extends BaseActions {
  
  // Pour info doc Flummox : 
  // [Dans une action] The return value is then sent through the dispatcher automatically. (If you return undefined, Flummox skips the dispatch step.)
  
  async loadUniverse(universeId) {
    console.log('.A. UniverseActions.loadUniverse ' + universeId);
    try {
      return await this.fetch.universe(universeId);
    } catch (err) {
      console.log('!!! Error while UniverseActions.loadUniverse.');
      console.log(err);
    }
  }
  
  async loadUniverseByName(universeName) {
    console.log('.A. UniverseActions.loadUniverseByName ' + universeName);
    try {
      return await this.fetch.universeByName(universeName);
    } catch (err) {
      console.log('!!! Error while UniverseActions.loadUniverseByName.');
      console.log(err);
    }
  }
  
  async loadStartUniverse(userId) {
    console.log('.A. UniverseActions.LoadStartUniverse ' + userId);
    try {
      return await this.fetch.startUniverse();
    } catch (err) {
      console.log('!!! Error while UniverseActions.loadStartUniverse.');
      console.log(err);
    }
  }
  
  async loadAllUniverses() {
    console.log('.A. UniverseActions.loadAllUniverses');
    try {
      return await this.fetch.allUniverses();
    } catch (err) {
      console.log('!!! Error while UniverseActions.loadAllUniverses.');
      console.log(err);
    }
  }
  
  newUniverse(newUniverseName, newUniverseDescription) {
    console.log('.A. UniverseActions.newUniverse');
    return universe;
  }
  
}