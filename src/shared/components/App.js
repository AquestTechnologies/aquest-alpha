import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout, createUser, uploadFile } from '../actionCreators';
import LoadingBar from './app/LoadingBar';
import Home from './app/Home';

class App extends React.Component {
  
  render() {
    const { children, userId, logout, createUser, uploadFile } = this.props;
    
    return (
      <div> 
        <LoadingBar />
        { children ? children : <Home userId={userId} logout={logout} createUser={createUser} uploadFile={uploadFile} /> }
      </div>
    );
  }
}

const mapState = state => ({ userId: state.session.userId });
const mapActions = dispatch => bindActionCreators({ logout, createUser, uploadFile }, dispatch);

export default connect(mapState, mapActions)(App);
