import React from 'react';
import { Link } from 'react-router';

export default class Node extends React.Component {
  
  render() {
    const { universe } = this.props;
    const description = universe.get('description');
    const desc = description.length > 100 ? description.slice(0, 100) + '...' : description;
    
    return (
      <div style={{marginTop: 10}}>
        <Link to={'/_' + universe.get('id')}>
          {universe.get('name')}
        </Link>
        <span style={{marginLeft: 10, fontSize: '1.6rem'}}>
          {desc}
        </span>
      </div>
    );
  }
}
