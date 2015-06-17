import React from 'react';
import { Link } from 'react-router';

import Node from './explore/Node.jsx';

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
    
    let setUniverse = this.props.flux.getActions('universeActions').setUniverse;
    
    return (
      <div style={divStyle}>
        {this.setBackLink()}
        {this.props.universes.map( (universe) => {
          return (
            <Node 
              key={universe.id} 
              universe={universe} 
              currentUniverse={this.props.currentUniverse} 
              setUniverse={setUniverse} 
              style={divStyle}
            />
          );
        })}
      </div>
    );
  }
}

export default Explore;