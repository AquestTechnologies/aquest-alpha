import React from 'react';
import { Link } from 'react-router';

import Node from './explore/Node.jsx';
import generateGraph from '../utils/graphGenerator.js';

class Explore extends React.Component {
  
  static runPhidippides(routerState) {
    return [{
      on:              ['server', 'client'],
      shouldBePresent: 'universe.universes',
      ifNot:           ['universeActions.loadUniverses', []]  
    }];
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
        {this.renderBackLink()}
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
        <br />
        <br />
        {this.renderGraph()}
      </div>
    );
  }
  
  
  renderBackLink() {
    if(this.props.universe) {
      return <Link to='universe' params={{universeHandle: this.props.universe.handle}}>Back</Link>;
    } else {
      return <Link to='home'>Starting Universe</Link>;
    }
  }
  
  renderGraph() {
    let graph = generateGraph(5);
    
    return(
      <div>
        <div>Node</div>
        <div>{JSON.stringify(graph.nodes)}</div>
        <br/>
        <div>Edges</div>
        <div>{JSON.stringify(graph.edges)}</div>
      </div>
    );
  }
}

export default Explore;