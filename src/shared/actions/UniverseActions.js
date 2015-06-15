import BaseActions from '../utils/BaseActions.js';

export default class UniverseActions extends BaseActions {
  
  // Pour info doc Flummox : 
  // [Dans une action] The return value is then sent through the dispatcher automatically. (If you return undefined, Flummox skips the dispatch step.)
  
  loadUniverse(universeId) {
    console.log('.A. UniverseActions.loadUniverse ' + universeId);
    let fetch = this.fetch;
    return new Promise(function(resolve, reject) {
      fetch.universe(universeId).then(function(data) {
        resolve(data);
      });
    });
  }
  
  loadUniverseByName(universeName) {
    console.log('.A. UniverseActions.loadUniverseByName ' + universeName);
    let fetch = this.fetch;
    return new Promise(function(resolve, reject) {
      fetch.universeByName(universeName).then(function(data) {
        resolve(data);
      });
    });
  }
  
  loadStartUniverse(userId) {
    console.log('.A. UniverseActions.LoadStartUniverse ' + userId);
    let fetch = this.fetch;
    return new Promise(function(resolve, reject) {
      fetch.startUniverse().then(function(data) {
        resolve(data);
      });
    });
  }
  
  loadAllUniverses() {
    console.log('.A. UniverseActions.loadAllUniverses');
    let fetch = this.fetch;
    return new Promise(function(resolve, reject) {
      fetch.allUniverses().then(function(data) {
        resolve(data);
      });
    });
  }
  
  newUniverse(newUniverseName, newUniverseDescription) {
    console.log('.A. UniverseActions.newUniverse');
    return true;
  }
  
}