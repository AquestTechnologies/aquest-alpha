import React from 'react';
import { Link } from 'react-router';
import connectToStores from 'flummox/connect';

class _Explore extends React.Component {
  
  constructor() {
    super();
    this.handleSwitchUniverse = (id) => {
      console.log('click ' + id);
      this.props.flux.getActions('universeActions').switchUniverse(id);
    };
  }
  
  render() {
    
    let divStyle = {
      width: '60%',
      margin: 'auto',
      fontSize: '2rem'
    };
    
    return (
      <div className="explore" style={divStyle}>
        <Link to='root'>Back</Link>
        {
          this.props.universes.map( (universe) => {
            return (
              <div key={universe.id}>
                <div onClick={this.handleSwitchUniverse.bind(null, universe.id)}>
                  {universe.name}
                </div>
                {universe.description}
              </div>
            );
          })
        }
      </div>
    );
  }
}

_Explore.defaultProps = {
  //universes: [{id: 0, name: 'Startups', description: 'Lorem Ipsum'}, {id: 1, name: 'Design', description: 'Lorem Design Ipsum'}],
};

_Explore = connectToStores(_Explore, {
  universeStore: store => ({
    universes: store.getAllUniverses()
  })
});

export default _Explore;