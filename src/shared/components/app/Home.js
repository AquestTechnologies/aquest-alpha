import React from 'react';
import Login from './Login';
import Signup from './Signup';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout } from '../../actionCreators';

class Home extends React.Component {
  
  renderLogin() {
    const { userId, logout } = this.props;
    const s2 = { 
      display : 'flex', 
      alignContent: 'space-between',
    };
    
    return userId ?
      <div style={{marginTop: '20'}}>
        <button onClick={logout}>Logout</button>
      </div> :
      <div style={s2}>
        <Login />
        <Signup />
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

const mapState = state => ({
  userId: state.session.userId
});

const mapActions = dispatch => bindActionCreators({ logout }, dispatch);

export default connect(mapState, mapActions)(Home);
