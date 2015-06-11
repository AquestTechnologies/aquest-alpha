import React      from 'react';

import Menu       from './universe/Menu.jsx';
import Chat       from './universe/Chat.jsx';
import Inventory  from './universe/Inventory.jsx';

class Universe extends React.Component {
  
  // Load les données initiales
  static async populateFluxState( { flux, routerState } ) {
    let a = flux._stores.universeStore.state.universe;
    let b = flux._stores.topicStore.state.topics;
    let c = flux._stores.chatStore.state.chat;
    if ( !a || !b || !c) {
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
      
      if ( !c ) {
        const chatActions    = flux.getActions('chatActions');
        await chatActions.loadChat(flux._stores.universeStore.state.universe.chatId); //Très mauvais, passe undifined si la promise précedante à échouée
      }
    } else {
      console.log('.c. Universe already initialized');
    }
  }
  
  componentWillMount () {
    if (this.props.params.universeName !== this.props.universe.name) {
      console.log('.c. Initializing Universe bad match');
      //A faire
    }
  }
  
  render() {
    return (
      <div>
        <Menu />
        <Inventory universe={this.props.universe} topics={this.props.topics} />
        <Chat chat={this.props.chat} />
      </div>
    );
  }
}

Universe.defaultProps = {
    topics: [],
    chat: {
      id: 0,
      name: 'Default prop chat',
      messages: []
    }
};

// Permet d'acceder a this.context.router
Universe.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default Universe;