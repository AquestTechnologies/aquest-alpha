import { Flux } from 'flummox';
import UniverseActions from './actions/UniverseActions.js'
import UniverseStore from './stores/UniverseStore.js'

export default class extends Flux {

  constructor() {
    super();

    this.createActions('universes', UniverseActions);

    // The extra argument(s) are passed to the UniverseStore constructor
    this.createStore('universes', UniverseStore, this);
  }

}
//You can access a Flux instance’s actions and stores using getActions(key) and getStore(key).