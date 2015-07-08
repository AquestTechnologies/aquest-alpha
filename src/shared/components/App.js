import React                from 'react';
import {RouteHandler}       from 'react-router';

import {bindActionCreators} from 'redux';
import {Connector}          from 'redux/react';

import * as actions from '../actions';

import LoadingBar           from './common/LoadingBar';

function select(state) {
  return { 
    globals:    state.globals,
    universes:  state.universes.toJS(),
    chats:      state.chats.toJS(),
    records:    state.records,
  };
}

export default class App extends React.Component {

  render() {
    return (
      <Connector select={select}>
        {
          ({ 
            globals,
            universes,
            chats,
            records,
            dispatch,
          }) => 
          <div>
            <LoadingBar 
              records = {records}
            />
            <RouteHandler 
              globals={globals}
              universes={universes}
              chats={chats}
              {...bindActionCreators(actions, dispatch)} 
            />
          </div>
        }
      </Connector>
    );
  }
}