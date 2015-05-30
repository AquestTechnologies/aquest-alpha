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

  getAllUniverses() { 
    //async fetch
    return [{id: 0, name: 'Startups', description: 'Lorem Ipsum'}, {id: 1, name: 'Design', description: 'Lorem Design Ipsum'}, {id: 3, name: 'Dev', description: 'Lorem Dev Ipsum'}];
    /*this.setState({
      universes: this.state.messages.concat([message]),
    });*/
  }

}

export default UniverseStore;