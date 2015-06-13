import React      from 'react';
import {RouteHandler}      from 'react-router';

import Menu       from './universe/Menu.jsx';
import Chat       from './universe/Chat.jsx';
import Inventory  from './universe/Inventory.jsx';

class Universe extends React.Component {
  
  // Load les données initiales
  static async populateFluxState( { flux, routerState } ) {
    let storeUniverse       = flux._stores.universeStore.state.universe;
    let storeUniverseName   = storeUniverse? storeUniverse.name : '';
    let desiredUniverseName = routerState.params.universeName;
    
    if (!storeUniverse) {
      console.log('.c. Initializing Universe');
      // Si Universe n'a jamais été chargé et que la route est / alors on charge l'univers préféré de l'utilisateur
      const universeActions = flux.getActions('universeActions');
      routerState.pathname === '/' ? await universeActions.loadStartUniverse(0) : await universeActions.loadUniverseByName(desiredUniverseName);
    
    } else if (desiredUniverseName !== storeUniverseName) {
      console.log('.c. Initializing Universe');
      const topicActions = flux.getActions('topicActions');
      const chatActions = flux.getActions('chatActions');
      topicActions.flushTopics();
      chatActions.flushChat();
      
    } else {
      console.log('.c. Universe already initialized');
    }
  }
  
  componentWillMount () {
    if (this.props.params.universeName !== this.props.universe.name) {
      console.log('.c. Universe bad match !');
      //A faire, attention à user's starting universe
    }
  }
  
  render() {
    let topicActions = this.props.flux.getActions('topicActions');
    let chatActions = this.props.flux.getActions('chatActions');
    
    let actions = {
       loadTopics: topicActions.loadTopics,
       loadChat: chatActions.loadChat,
    };
    
    return (
      <div>
        <Menu />
        <RouteHandler 
          universe={this.props.universe} 
          inventory={this.props.inventory} 
          chat={this.props.chat} 
          actions={actions} 
        />
      </div>
    );
  }
}

Universe.defaultProps = {
  universe: {}
};

export default Universe;