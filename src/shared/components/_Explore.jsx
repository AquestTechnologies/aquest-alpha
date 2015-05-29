import React from 'react';
import {Link} from 'react-router';
import connectToStores from 'flummox/connect';

class _Explore extends React.Component {
  
  /*constructor(props) {
    super(props);
    this.state = UniverseStore.getState();
  }
  
  componentWillMount() {
  }

  componentDidMount() {
    UniverseStore.listen(this.onChange);
  }

  componentWillUnmount() {
    UniverseStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }*/
  render() {
    var renderItems = this.props.universes.map(function (universe) {
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
        <Link to='root'>Cancel</Link>
        {renderItems}
      </div>
    );
  }
}

_Explore.defaultProps = {
  //universes: [{id: 0, name: 'Startups', description: 'Lorem Ipsum'}, {id: 1, name: 'Design', description: 'Lorem Design Ipsum'}],
};

_Explore = connectToStores(_Explore, {
  universe: store => ({
    universes: store.getAllUniverses()
  })
});

export default _Explore;