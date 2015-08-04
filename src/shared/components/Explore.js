import React from 'react';
import Node  from './explore/Node';
import Graph from './explore/Graph';
import { Link } from 'react-router';


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
  
  renderList(universes) {
    return Object.keys(universes).map(key =>
      <Node 
        key={key} 
        universe={universes[key]} 
        transitionTo={this.props.transitionTo}
      />
    );
  }
  
  render() {
    // CSS temporaire
    const divStyle = {
      width: '60%',
      margin: '0 auto 0 auto',
      fontSize: '2rem',
    };
    
    const {universes} = this.props;
    
    return (
      <div>
        <div style={divStyle}>
          <Link to='/'>Home</Link>
          <br/>
          { this.renderList(universes) }
          <br/>
          <Link to='/Create_universe'>Create a new universe</Link>
        </div>
        <Graph />
      </div>
    );
  }
  
}
