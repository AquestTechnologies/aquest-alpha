import React                from 'react';
import {RouteHandler}       from 'react-router';

import {bindActionCreators} from 'redux';
import {Connector}          from 'react-redux';

import * as actionCreators from '../experiment';

import LoadingBar           from './common/LoadingBar';

function select(state) {
  // console.log('___select___');
  // console.log(state.universes.toJS()['Design'].lastInventoryUpdate);
  return { 
    universes:  state.universes.toJS(),
    topics:     state.topics.toJS(),
    chats:      state.chats.toJS(),
    users:      state.users.toJS(),
    records:    state.records,
  };
}

export default class App extends React.Component {

  render() {
    return (
      <Connector select={select}>
        {
          ({ 
            universes,
            topics,
            chats,
            users,
            records,
            dispatch,
          }) => 
          <div>
            <LoadingBar records = {records} />
            <RouteHandler 
              universes = {universes}
              topics = {topics}
              chats = {chats}
              {...bindActionCreators(actionCreators, dispatch)} 
            />
          </div>
        }
      </Connector>
    );
  }
}