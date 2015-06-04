import React from 'react';
import {Link} from 'react-router';

class ExploreItem extends React.Component {
  
  render() {
    const universe = this.props.universe;
    const switchUniverse = this.props.switchUniverse;
    console.log(this.props);
    return (
      <div>/*
          <Link to='home' params={{universe: universe.name}}>
            {universe.name}
          </Link>*/
          <div onClick={switchUniverse(universe.id)}>
            {universe.name}
          </div>
          <br />
          {universe.description}
      </div>
    );
  }
}

ExploreItem.defaultProps = {
  universe: {id: 0, name: 'Startups', description: 'Lorem Ipsum'}
};

export default ExploreItem;