import BaseStore from '../utils/BaseStore.js';

export default class UniverseStore extends BaseStore {
  
  constructor(flux) {
    super();

    const universeActionIds = flux.getActionIds('universeActions');
    this.registerAsync(universeActionIds.loadUniverse, this.handleBeginAsyncRequest, this.handleLoadUniverse, this.handleErrorAsyncRequest);
    this.registerAsync(universeActionIds.loadUniverseByName, this.handleBeginAsyncRequest, this.handleLoadUniverse, this.handleErrorAsyncRequest);
    this.registerAsync(universeActionIds.loadStartUniverse, this.handleBeginAsyncRequest, this.handleLoadUniverse, this.handleErrorAsyncRequest);
    this.registerAsync(universeActionIds.loadAllUniverses, this.handleBeginAsyncRequest, this.handleLoadAllUniverses, this.handleErrorAsyncRequest);
    this.registerAsync(universeActionIds.newUniverse, this.handleBeginAsyncRequest, this.handleNewUniverse, this.handleErrorAsyncRequest);
    
    this.state = {}; // Reset le state, important (?)
    console.log('.S. UniverseStore initialized');
  }
  
  // Les getters servent principalement à FluxComponent.connectToStores
  // ils fetch le state flux pour qu'il soit injecté dans le state React
  getUniverse() {
    // console.log('.S. UniverseStore.getUniverse');
    return this.state.universe;
  }
    
  getAllUniverses() { 
    // console.log('.S. UniverseStore.getAllUniverses');
    return this.state.allUniverses;
  }
  
  // Les handlers correspondent au traitement du state après avoir executé une action
  handleLoadUniverse(universe) {
    this.setState({
      universe: universe,
      isLoading: false
    });
    console.log('.S. UniverseStore.handleLoadUniverse set ' + universe.name);
  }
  
  handleLoadAllUniverses(universes) {
    this.setState({
      allUniverses: universes,
      isLoading: false
    });
    console.log('.S. UniverseStore.handleLoadAllUniverses');
  }
  
  handleNewUniverse(universe) {
    this.setState({
      universe: universe
    });
    console.log('.S. UniverseStore.handleNewUniverse');
  }
  
}