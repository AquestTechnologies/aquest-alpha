import React from 'react';
import { Link } from 'react-router';

import Graph from './explore/Graph.jsx';
import NewUniverse from './explore/NewUniverse.jsx';

class Explore extends React.Component {
  
  // Load les données initiales, doit être appelé avant FluxComponent.connectToStores
  static async populateFluxState({ flux, routerState }) {
    if(!flux._stores.universeStore.state.allUniverses) {
      console.log('.c. Initializing Explore');
      const universeActions = flux.getActions('universeActions');
      await universeActions.loadAllUniverses();
    } else {
      console.log('.c. Explore already initialized');
    }
  }
  
  render() {
    // CSS temporaire
    let divStyle = {
      width: '60%',
      margin: 'auto',
      fontSize: '2rem'
    };
    
    let universeActions = this.props.flux.getActions('universeActions');
    let topicActions = this.props.flux.getActions('topicActions');
    let chatActions = this.props.flux.getActions('chatActions');
    
    let actions = {
       loadUniverse: universeActions.loadUniverse,
       newUniverse: universeActions.newUniverse,
       flushTopics: topicActions.flushTopics,
       loadTopics: topicActions.loadTopics,
       flushChat: chatActions.flushChat,
       loadChat: chatActions.loadChat
    };
    return (
      <div style={divStyle}>
        <Link to='root'>Back</Link>
        <Graph universes={this.props.universes} actions={actions} />
        <NewUniverse actions={actions} />
      </div>
    );
  }
}

export default Explore;