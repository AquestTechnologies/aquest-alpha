import { Store } from 'flummox';

class UniverseStore extends Store {

  constructor(flux) {
    super(); // Don't forget this step

    const universeActionIds = flux.getActionIds('universes');
    //this.register(universeActionIds.createMessage, this.handleNewMessage);

    this.state = {
      //messages: [],
    };
  }
/*
  handleNewMessage(message) {
    this.setState({
      messages: this.state.messages.concat([message]),
    });
  }*/

}

export default UniverseStore;