import React from 'react';
import { Link } from 'react-router';
import Signup from './home/Signup';
import Login from './home/Login';

export default class Home extends React.Component {
  
  render() {
    const {login, createUser} = this.props;
    
    const s1 = {
      fontSize: '2rem',
      width: '60%',
      margin: '0 auto 0 auto',
    };
      
    const s2 = { 
      display : 'flex', 
      alignContent: 'space-between',
    };
    
    return (
      <div style={s1}>    
      
        <h1>Aquest</h1>
        <Link to='/Explore'>Explore</Link>
        
        <div style={s2}>
          <Login login={login} />
          <Signup createUser={createUser} />
        </div>
        
      </div>
    );
  }
  
}
