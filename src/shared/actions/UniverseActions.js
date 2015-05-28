import alt from '../alt';

class UniverseActions {
  
  updateCurrentUniverse(universe) {
    this.dispatch(universe);
  }
}

export default alt.createActions(UniverseActions);