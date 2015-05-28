import alt from '../alt.js';
import UniverseActions from '../actions/UniverseActions.js';
import Fetch from '../utils/fetchers.js';

class UniverseStore {
  
  constructor() {
    //Instance variables defined anywhere in the store will become the state.
    this.currentUniverse = {name: "Startup", description: "Lorem ipsum."};
    
    //we bind our action handlers to our actions.
    this.bindListeners({
      handleUpdateCurrentUniverse:  UniverseActions.UPDATE_CURRENT_UNIVERSE,
    });
    //c'est pas mieux de faire 
    //this.bindActions(UniverseActions);
    //?
  }
  
  handleUpdateCurrentUniverse(universe) {
    this.currentUniverse = universe;
    // optionally return false to suppress the store change event
  }
}

export default alt.createStore(UniverseStore, 'UniverseStore');