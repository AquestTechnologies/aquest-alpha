import React from 'react';
import Home from './app/Home';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoadingBar from './app/LoadingBar';
import actionCreators from '../actionCreators';
import websocket     from 'socket.io-client';

class App extends React.Component {
  
  render() {
    const {children, universes, topics, chats, session, users, router, records, actions, dispatch, websocket} = this.props;
    
    return <div> 
      <LoadingBar records={records} />
      { 
        children && !(children instanceof Array) ? 
          React.cloneElement(children, { // This burns my eyes, when RR1.0 will be out a better solution might appear
            universes,
            topics,
            chats,
            users,
            session,
            router,
            actions,
            websocket
          }) 
          :
          <Home session={session} actions={actions} />
      }
    </div>;
  }
}

const mapReducerd =(state, props) => ({ 
  universes: state.universes.toJS(),
  topics:    state.topics.toJS(),
  chats:     state.chats.toJS(),
  users:     state.users.toJS(),
  records:   state.records,
  session:   state.session,
  router:    state.router,
  websocket
});

const mapActions = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
  dispatch,
});

export default connect(mapReducerd, mapActions)(App);
