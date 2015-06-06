import FluxComponent from 'flummox/component';
import React          from 'react';

import Inventory      from './universe/Inventory.jsx';
import Menu           from './universe/Menu.jsx';
import Chat           from './universe/Chat.jsx';

class _Universe extends React.Component {
  
  // Load les données initiales, doit être appelé avant FluxComponent.connectToStores
  static async populateFluxState({flux}) {
    if ( !flux._stores.universeStore.state.currentUniverse ) {
      console.log('.c. Initializing _Universe');
      const universeActions = flux.getActions('universeActions');
      const topicActions    = flux.getActions('topicActions');
      await universeActions.loadStartUniverse();
      await topicActions.loadCurrentTopics(flux._stores.universeStore.state.currentUniverse.id); //Très mauvais, passe undifined si la promise précedante à échouée
    } else {
      console.log('.c. _Universe already initialized');
    }
  }
  
  render() {
    return (
      // Synchronise le state flux et le state react
      // FluxComponent dispose du state flux dans son state
      // Ses enfants directs disposent du state flux dans leurs props
      <FluxComponent connectToStores={{
        universeStore: store => ({
          universe: store.getCurrentUniverse()
        }),
        topicStore: store => ({
          topics: store.getCurrentTopics()
        })
      }}>
        <Menu />
        <Inventory />
        <Chat />
      </FluxComponent>
    );
  }
}

export default _Universe;