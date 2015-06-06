import React from 'react';
import { Link } from 'react-router';
import connectToStores from 'flummox/connect';
import FluxComponent from 'flummox/component';

import Graph from './explore/Graph.jsx';

class _Explore extends React.Component {
  
  static async routerWillRun({flux}) {
    if(!flux._stores.universeStore.state.allUniverses) {
      console.log('... _Explore.routerWillRun running');
      const universeActions = flux.getActions('universeActions');
      await universeActions.loadAllUniverses();
    } else {
      console.log('... _Explore.routerWillRun not running');
    }
  }
  
  render() {
    let divStyle = {
      width: '60%',
      margin: 'auto',
      fontSize: '2rem'
    };
    
    return (
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

_Explore.defaultProps = {
};

export default _Explore;