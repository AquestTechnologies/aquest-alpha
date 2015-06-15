import React from 'react';
import { Link } from 'react-router';

import Graph from './explore/Graph.jsx';

class Explore extends React.Component {
  
  static runPhidippides(routerState) {
    return [{
      taskName: 'explore',
      dependency: null,
      shouldBePresent: {
        store: 'universeStore',
        data: 'allUniverses',
        shouldHaveValue: null
      },
      ifNot: {
        actions: 'universeActions',
        creator: 'loadAllUniverses',
        args : []
      }
    }];
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
        <Graph universes={this.props.universes} currentUniverse={this.props.universe} />
      </div>
    );
  }
}

export default Explore;