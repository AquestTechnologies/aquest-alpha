import BaseStore from '../utils/BaseStore.js';

export default class NewStore extends BaseStore {
  
  constructor(flux) {
    super();

    const stuffActionIds = flux.getActionIds('stuffActions');
    this.registerAsync(stuffActionIds.loadNew, this.handleBeginAsyncRequest, this.handleLoadNew, this.handleErrorAsyncRequest);
    this.register(stuffActionIds.syncAction, this.syncAction);
    
    this.state = {}; // Reset le state, important (?)
    console.log('.S. NewStore initialized');
  }
  
  // Les getters servent principalement à FluxComponent.connectToStores
  // ils fetch le state flux pour qu'il soit injecté dans le state React
  getNew() {
    console.log('.S. NewStore.getNew');
    return this.state.stuff;
  }
    
  // Les handlers correspondent au traitement du state après avoir executé une action
  handleLoadNew(stuff) {
    this.setState({
      stuff: stuff,
      isLoading: false
    });
    console.log('.S. NewStore.handleLoadNew set ' + stuff.name);
  }
  
}