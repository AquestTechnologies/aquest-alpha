import React      from 'react';

import Menu       from './universe/Menu.jsx';
import Chat       from './universe/Chat.jsx';
import Inventory  from './universe/Inventory.jsx';

class Universe extends React.Component {
  
  // Load les données initiales, doit être appelé avant FluxComponent.connectToStores
  static async populateFluxState( { flux, routerState } ) {
    let a = flux._stores.universeStore.state.universe;
    let b = flux._stores.topicStore.state.topics;
    if ( !a || !b ) {
      console.log('.c. Initializing Universe');
      
      if ( !a ) {
        // Si Universe n'a jamais été chargé et que la route est / alors on charge l'univers préféré de l'utilisateur
        const universeActions = flux.getActions('universeActions');
        routerState.pathname === '/' ? await universeActions.loadStartUniverse(0) : await universeActions.loadUniverseByName(routerState.params.universeName);
      }
      if ( !b && !flux._stores.topicStore.state.isLoading ) {
        const topicActions    = flux.getActions('topicActions');
        await topicActions.loadTopics(flux._stores.universeStore.state.universe.id); //Très mauvais, passe undifined si la promise précedante à échouée
      } 
    } else {
      console.log('.c. Universe already initialized');
    }
  }
  
  
  render() {
    let topics = this.props.topics ? this.props.topics : [];
    return (
      <div>
        <Menu />
        <Inventory universe={this.props.universe} topics={topics} />
        <Chat />
      </div>
    );
  }
}

// Permet d'acceder a this.context.router
Universe.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default Universe;