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
  
  setBackLink() {
    if(this.props.universe) {
      return <Link to='universe' params={{universeName: this.props.universe.name}}>Back</Link>;
    } else {
      return <Link to='home'>Starting Universe</Link>;
    }
  }
  
  render() {
    // CSS temporaire
    let divStyle = {
      width: '60%',
      margin: 'auto',
      fontSize: '2rem'
    };
    
    return (
      <div style={divStyle}>
        {this.setBackLink()}
        <Graph universes={this.props.universes} currentUniverse={this.props.universe} actions={actions} />
        <NewUniverse actions={actions} />
      </div>
    );
  }
}

export default Explore;