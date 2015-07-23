import React from 'react';
import { Link } from 'react-router';

import Node from './explore/Node';
// import Pseudos from './explore/Pseudos';
import Graph from './explore/Graph';


export default class Explore extends React.Component {
  
  static runPhidippides(routerState) {
    return [{
      id:      'universes',
      creator: 'readUniverses',
      args:    []
    }];
  }
  
  componentDidMount() {
    if (Object.keys(this.props.universes).length < 2) this.props.readUniverses();
  }
  
  renderGraph(universes) {
    return Object.keys(universes).map(key => {
      return(
        <Node 
          key={key} 
          universe={universes[key]} 
        />
      );
    });
  }
  
  render() {
    // CSS temporaire
    const divStyle = {
      width: '60%',
      margin: '0 auto 0 auto',
      fontSize: '2rem',
    };
    
    const exploreStyle = {
      position: 'fixed', 
      width: '100%',
      height: '100%',
      // backgroundColor: '#222',
      // color: '#fff',
    };
    
    const {universes} = this.props;
    
    return (
      <div style={exploreStyle}>
        <div style={divStyle}>
          <Link to='home'>Home</Link>
          <br/>
          {this.renderGraph(universes)}
          <br/>
          <Link to='newUniverse'>Create a new universe</Link>
        </div>
        <Graph />
        {/*<br />
        <br />
        <div style={divStyle}>
          <Pseudos />
        </div>*/}
      </div>
    );
  }
  
}
