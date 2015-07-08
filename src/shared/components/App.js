import React                from 'react';
import {RouteHandler}       from 'react-router';

import {bindActionCreators} from 'redux';
import {Connector}          from 'redux/react';

import * as universesActions from '../actions/universesActions';
import * as chatsActions     from '../actions/chatsActions';
import * as topicsActions     from '../actions/topicsActions';

import LoadingBar           from './common/LoadingBar';

function select(state) {
  return { 
    globals:    state.globals,
    universes:  state.universes,
    topics:     state.topics,
    chats:      state.chats,
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
            topics,
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
              topics={topics}
              chats={chats}
              {...bindActionCreators(universesActions, dispatch)} 
              {...bindActionCreators(chatsActions, dispatch)} 
              {...bindActionCreators(topicsActions, dispatch)} 
            />
          </div>
        }
      </Connector>
    );
  }
}