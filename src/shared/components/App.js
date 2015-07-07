import React                from 'react';
import {RouteHandler}       from 'react-router';

import {bindActionCreators} from 'redux';
import {Connector}          from 'redux/react';

import * as universeActions from '../actions/universeActions';
import * as chatActions     from '../actions/chatActions';
import * as topicActions     from '../actions/topicActions';

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
              {...bindActionCreators(universeActions, dispatch)} 
              {...bindActionCreators(chatActions, dispatch)} 
              {...bindActionCreators(topicActions, dispatch)} 
            />
          </div>
        }
      </Connector>
    );
  }
}