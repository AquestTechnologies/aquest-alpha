import React from 'react';
import {Link} from 'react-router';

class ExploreItem extends React.Component {
  
  render() {
    let universe = this.props.universe;
    return (
      <div /*key={universe.id}*/>
          <Link to='home' params={{universe: universe.name}}>
            {universe.name}
          </Link>
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