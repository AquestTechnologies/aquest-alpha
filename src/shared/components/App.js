import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout, createUser } from '../actionCreators';
import LoadingBar from './app/LoadingBar';
import Home from './app/Home';
// import websocket from 'socket.io-client';

class App extends React.Component {
  
  render() {
    const { children, userId, logout, createUser } = this.props;
    
    return (
      <div> 
        <LoadingBar />
        { children ? children : <Home userId={userId} logout={logout} createUser={createUser} /> }
      </div>
    );
  }
}

// const mapState = state => ({ userId: state.session.userId, websocket });
const mapState = state => ({ userId: state.session.userId });
const mapActions = dispatch => bindActionCreators({ logout, createUser }, dispatch);

export default connect(mapState, mapActions)(App);
