import React from 'react';
import Node from './Node.jsx'

class Graph extends React.Component {
  
  render() {
    let divStyle = {
      marginBottom: '1rem',
    }; 
    
    return (
      <div>
        {
          this.props.universes.map( (universe) => {
            return (
              <Node 
                key={universe.id} 
                universe={universe} 
                currentUniverse={this.props.currentUniverse} 
                setTopic={this.props.setTopic} 
                style={divStyle}
              />
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