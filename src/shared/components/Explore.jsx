import React from 'react';
import { Link } from 'react-router';

import Graph from './explore/Graph.jsx';

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
    
    let actions = {
       loadUniverse: this.props.flux.getActions('universeActions').loadUniverse,
       flushTopics: this.props.flux.getActions('topicActions').flushTopics,
       loadTopics: this.props.flux.getActions('topicActions').loadTopics,
       flushChat: this.props.flux.getActions('chatActions').flushChat,
       loadChat: this.props.flux.getActions('chatActions').loadChat
    };
    return (
      <div style={divStyle}>
        <Link to='root'>Back</Link>
        <Graph universes={this.props.universes} actions={actions}/>
      </div>
    );
  }
}

export default Explore;