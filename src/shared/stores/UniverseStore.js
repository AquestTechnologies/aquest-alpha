// import { Store } from 'flummox';
import BaseStore from '../utils/BaseStore.js';

class UniverseStore extends BaseStore {
  
  constructor(flux) {
    super(); // Don't forget this step

    const universeActionIds = flux.getActionIds('universeActions');
    this.register(universeActionIds.switchUniverse, this.handleSwitchUniverse);
    this.registerAsync(universeActionIds.getStartUniverse, this.handleBeginAsyncRequest, this.handleGetStartUniverse, this.handleErrorAsyncRequest);

    this.state = {
      currentUniverse: {id: 0, name: 'Default', description: 'This ain\'t good Joe'}
    };
    console.log('... UniverseStore initialized');
  }
  
  getCurrentUniverse() {
    return this.state.currentUniverse;
  }
  
  setCurrentUniverse(universe) {
    this.setState({
      currentUniverse: universe
    });
  }
  
  handleGetStartUniverse(startUniverse) {
    this.setCurrentUniverse(startUniverse);
  }
  
  //Synchrone?
  handleSwitchUniverse(id) {
    this.setCurrentUniverse({id: 0, name: 'Startups', description: 'Lorem Ipsum'});
  }

  getAllUniverses() { 
    //async fetch 
    return [{id: 0, name: 'Startups', description: 'Lorem Ipsum'}, {id: 1, name: 'Design', description: 'Lorem Design Ipsum'}, {id: 3, name: 'Dev', description: 'Lorem Dev Ipsum'}];
  }

}

export default UniverseStore;