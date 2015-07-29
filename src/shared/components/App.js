import React                from 'react';
import { RouteHandler }       from 'react-router';
import Home from './Home';
import { bindActionCreators } from 'redux';
import { Connector }          from 'react-redux';

import * as actionCreators from '../actionCreators';

import LoadingBar           from './common/LoadingBar';

function select(state) {
  return { 
    universes:  state.universes.toJS(),
    topics:     state.topics.toJS(),
    chats:      state.chats.toJS(),
    users:      state.users.toJS(),
    records:    state.records,
    router:     state.router,
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
      <Connector select={select}> {
        ({ 
          universes,
          topics,
          chats,
          users,
          records,
          router,
          dispatch,
        }) => 
          <div> 
            <LoadingBar records={records} />
            { 
              children && !(children instanceof Array) ? 
                React.cloneElement(children, simpleMerge({
                    universes,
                    topics,
                    chats,
                    users,
                    router,
                  }, bindActionCreators(actionCreators, dispatch))) 
                : <Home {...bindActionCreators(actionCreators, dispatch)} />
            }
          </div>
      } </Connector>
    );
  }
}

/*
<LoadingBar records = {records} />
            <RouteHandler 
              router = {router}
              universes = {universes}
              topics = {topics}
              chats = {chats}
              
            />*/
            
            