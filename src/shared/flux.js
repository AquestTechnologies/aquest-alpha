import { Flummox } from 'flummox';
import UniverseActions from './actions/UniverseActions.js'
import UniverseStore from './stores/UniverseStore.js'

export default class Flux extends Flummox {
  constructor() {
    super();
    this.createActions('universe', UniverseActions);
    // The extra argument(s) are passed to the UniverseStore constructor
    this.createStore('universe', UniverseStore, this);
  }
}