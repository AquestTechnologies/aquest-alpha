import FluxComponent from 'flummox/component';
import React from 'react';
import { Link } from 'react-router';

import Graph from './explore/Graph.jsx';

class _Explore extends React.Component {
  
  // Load les données initiales, doit être appelé avant FluxComponent.connectToStores
  static async populateFluxState({flux}) {
    if(!flux._stores.universeStore.state.allUniverses) {
      console.log('.c. Initializing _Explore');
      const universeActions = flux.getActions('universeActions');
      await universeActions.loadAllUniverses();
    } else {
      console.log('.c. _Explore already initialized');
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
      // Synchronise le state flux et le state react
      // FluxComponent dispose du state flux dans son state react
      // Ses enfants directs disposent du state flux dans leurs props
      <FluxComponent connectToStores={{
        universeStore: store => ({
          universes: store.getAllUniverses()
        })
      }}>
        <div style={divStyle}>
          <Link to='root'>Back</Link>
        </div>
        <Graph />
      </FluxComponent>
    );
  }
}

export default _Explore;