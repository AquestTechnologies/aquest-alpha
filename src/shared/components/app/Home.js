import React from 'react';
import { Link } from 'react-router';
import Signup from './Signup';
import Login from './Login';

export default class Home extends React.Component {
  
  renderLogin() {
    const {session: {userId}, login, logout, createUser} = this.props;
    const s2 = { 
      display : 'flex', 
      alignContent: 'space-between',
    };
    
    return userId ?
      <div style={{marginTop: '20'}}>
        <button onClick={logout}>Logout</button>
      </div> :
      <div style={s2}>
        <Login login={login} />
        <Signup createUser={createUser} />
      </div>;
  }
  
  render() {
    const s1 = {
      fontSize: '2rem',
      width: '60%',
      margin: '0 auto 0 auto',
    };
    
    return (
      <div style={s1}>    
      
        <h1>Aquest</h1>
        <Link to='/Explore'>Explore</Link>
        { this.renderLogin() }
        
      </div>
    );
  }
  
}
