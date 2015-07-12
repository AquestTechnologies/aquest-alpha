import React from 'react';
import { Link } from 'react-router';

import Node from './explore/Node';
import Pseudos from './explore/Pseudos';
import Graph from './explore/Graph';

export default class Explore extends React.Component {
  
  static runPhidippides(routerState) {
    return [{
      id:      'universes',
      creator: 'loadUniverses',
      args:    []
    }];
  }
  
  componentDidMount() {
    if (Object.keys(this.props.universes).length < 2) this.props.loadUniverses();
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
      margin: 'auto',
      fontSize: '2rem'
    };
    
    const {universes} = this.props;
    
    return (
      <div style={divStyle}>
        {this.renderGraph(universes)}
        <br />
        <br />
        <Graph />
        <br />
        <br />
        <Pseudos />
      </div>
    );
  }
  
  // renderBackLink(universeId) {
  //   let universe = this.props.universes(this.props.params.universeId);
  //   if(universe) {
  //     return <Link to='universe' params={{universeId: universe.get('id')}}>Back</Link>;
  //   } else {
  //     return <Link to='home'>Starting Universe</Link>;
  //   }
  // }
  
}
