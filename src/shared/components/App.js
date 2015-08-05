import React from 'react';
import Home from './app/Home';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoadingBar from './app/LoadingBar';
import actionCreators from '../actionCreators';

function simpleMerge(a, b) {
  Object.keys(b).forEach(key => b.hasOwnProperty(key) ? a[key] = b[key] : {});
  return a;
}

class App extends React.Component {
  
  render() {
    const {children, universes, topics, chats, session, users, userId, router, records, dispatch} = this.props;
    
    return <div> 
      <LoadingBar records={records} />
      { 
        children && !(children instanceof Array) ? 
          React.cloneElement(children, simpleMerge({ // This burns my eyes, when RR1.0 will be out a better solution might appear
              universes,
              topics,
              chats,
              session,
              users,
              userId,
              router,
            }, bindActionCreators(actionCreators, dispatch))) :
          <Home session={session} {...bindActionCreators(actionCreators, dispatch)} />
      }
    </div>;
  }
}

const select = state => ({ 
  universes: state.universes.toJS(),
  topics:    state.topics.toJS(),
  chats:     state.chats.toJS(),
  users:     state.users.toJS(),
  records:   state.records,
  session:   state.session,
  router:    state.router,
});

export default connect(select)(App);
