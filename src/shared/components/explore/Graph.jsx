import React from 'react';
import Node from './Node.jsx'

class Graph extends React.Component {
  
  render() {
    let divStyle = {
      width: '60%',
      margin: 'auto',
      fontSize: '2rem'
    };
    
    return (
      <div style={divStyle}>
        {
          this.props.universes.map( (universe) => {
            return (
              <Node key={universe.id} universe={universe} loadUniverse={this.props.flux.getActions('universeActions').loadUniverse}/>
            );
          })
        }
      </div>
    );
  }
}

Graph.defaultProps = {
};

export default Graph;