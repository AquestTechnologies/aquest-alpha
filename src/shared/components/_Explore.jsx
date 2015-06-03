import React from 'react';
import ExploreItem from './ExploreItem.jsx';
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
    var renderedItems = this.props.universes.map(function (universe) {
      return (
        <ExploreItem universe={universe} key={universe.id}/>
      );
    });
    
    var divStyle = {
      width: '60%',
      margin: 'auto',
      fontSize: '2rem'
    };

    return (
      
      <div className="explore" style={divStyle}>
        <Link to='root'>Back</Link>
        {renderedItems}
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