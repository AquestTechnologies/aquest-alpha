import React from 'react';
import {Link} from 'react-router';

class Home extends React.Component {
  
  render() {
    return (
      <div style={{
        fontSize: '2rem',
        width: '60%',
        margin: '50 auto 0 auto'
      }}>      
        Aquest
        <br/>
        <br/>
        <Link to='explore'>Explore</Link>
      </div>
    );
  }
  
}

export default Home;