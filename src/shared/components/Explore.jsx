import React from 'react';
import { Link } from 'react-router';

import Node from './explore/Node.jsx';

class Explore extends React.Component {
  
  static runPhidippides(routerState) {
    return [{
      on:              ['server', 'client'],
      shouldBePresent: 'universe.universes',
      ifNot:           ['universeActions.loadUniverses', []]  
    }];
  }
  
  setBackLink() {
    if(this.props.universe) {
      return <Link to='universe' params={{universeHandle: this.props.universe.handle}}>Back</Link>;
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
        {this.props.universes.map( (universe) => {
          return (
            <Node 
              key={universe.id} 
              universe={universe} 
              currentUniverse={this.props.currentUniverse} 
              setUniverse={this.props.setUniverse} 
              style={divStyle}
            />
          );
        })}
      </div>
    );
  }
}

export default Explore;