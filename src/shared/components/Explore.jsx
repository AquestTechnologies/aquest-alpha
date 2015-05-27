import React from 'react';
import {Link} from 'react-router';

class Explore extends React.Component {
  
  render() {
    var universeNodes = this.props.universes.map(function (universe) {
      return (
        <div key={universe.id}>
          <Link to='home' params={{universe: universe.name}}>
            {universe.name}
          </Link>
          <br />
          {universe.description}
        </div>
      );
    });
    
    var divStyle = {
      width: '60%',
      margin: 'auto',
      fontSize: '2rem'
    };

    return (
      
      <div className="explore" style={divStyle}>
        {universeNodes}
      </div>
    );
  }
}

Explore.defaultProps = {
  universes: [{id: 0, name: 'Startups', description: 'Lorem Ipsum'}, {id: 1, name: 'Design', description: 'Lorem Design Ipsum'}],
};

export default Explore;