import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout, createUser, uploadFile } from '../actionCreators';
import LoadingBar from './app/LoadingBar';
import ErrorBar from './app/ErrorBar';
import SuccessBar from './app/SuccessBar';
import Home from './app/Home';

class App extends React.Component {
  
  render() {
    const { children, userId, records, logout, createUser, uploadFile, lastError, lastSuccess } = this.props;
    
    return (
      <div> 
        <SuccessBar lastSuccess={lastSuccess} />
        <ErrorBar lastError={lastError} />
        <LoadingBar records={records} />
        { children ? children : <Home userId={userId} logout={logout} createUser={createUser} uploadFile={uploadFile} /> }
      </div>
    );
  }
}

const mapState = state => ({ 
  records: state.records,
  lastError: state.lastError,
  userId: state.session.userId,
  lastSuccess: state.lastSuccess,
});
const mapActions = dispatch => bindActionCreators({ logout, createUser, uploadFile }, dispatch);

export default connect(mapState, mapActions)(App);
