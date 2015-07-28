import React                from 'react';
import {RouteHandler}       from 'react-router';
import Home from './Home';
import {bindActionCreators} from 'redux';
import {Connector}          from 'react-redux';

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

export default class App extends React.Component {

  render() {
    console.log('props', this.props.children);
    const {children} = this.props;
    return (
      <Connector select={select}> {({ 
            universes,
            topics,
            chats,
            users,
            records,
            router,
            dispatch,
          }) => (
          <div> 
            {console.log('router', router)}
            {children ? children : <Home />}
          </div>
        )} </Connector>
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
              {...bindActionCreators(actionCreators, dispatch)} 
            />*/
            
            