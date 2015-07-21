import React from 'react';
import {Link} from 'react-router';
import Signup from './home/Signup';
import Login from './home/Login';

export default class Home extends React.Component {
  
  render() {
    const {login, createUser} = this.props;
    
    return (
      <div style={{
        fontSize: '2rem',
        width: '60%',
        margin: '50 auto 0 auto'
      }}>    
      
        <h1>Aquest</h1>
        
        <Link to='explore'>Explore</Link>
        
        <div style={{
          display : 'flex',
          alignContent: 'space-between',
        }}>
          <Login 
            login={login}
          />
          <Signup 
            createUser={createUser}
          />
        </div>
        
      </div>
    );
  }
  
}
