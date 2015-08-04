import React from 'react';
import Home from './app/Home';
import { Connector } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoadingBar from './app/LoadingBar';
import actionCreators from '../actionCreators';

function select(state) {
  return { 
    universes: state.universes.toJS(),
    topics:    state.topics.toJS(),
    chats:     state.chats.toJS(),
    users:     state.users.toJS(),
    records:   state.records,
    session:   state.session,
    router:    state.router,
  };
}

function simpleMerge(a, b) {
  Object.keys(b).forEach(key => b.hasOwnProperty(key) ? a[key] = b[key] : {});
  return a;
}

export default class App extends React.Component {

  render() {
    const {children} = this.props;
    
    return (
      <Connector select={select}> { // Connector's API will change soon
        ({ 
          universes,
          topics,
          chats,
          users,
          records,
          router,
          session,
          dispatch,
        }) => 
          <div> 
            <LoadingBar records={records} />
            { 
              children && !(children instanceof Array) ? 
                React.cloneElement(children, simpleMerge({ // This burns my eyes, when RR1.0 will be out a better solution might appear
                    universes,
                    topics,
                    chats,
                    session,
                    users,
                    router,
                  }, bindActionCreators(actionCreators, dispatch))) :
                <Home session={session} {...bindActionCreators(actionCreators, dispatch)} />
            }
          </div>
      } </Connector>
    );
  }
}
