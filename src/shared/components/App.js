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
    universe:           state.universe.universe,
    universes:          state.universe.universes,
    inventory:          state.topic.inventory,
    topic:              state.topic.topic,
    chat:              state.chat.chat,
    records:      state.records,
  };
}

export default class App extends React.Component {

  render() {
    return (
      <Connector select={select}>
        {
          ({ 
            universe,
            universes,
            inventory,
            topic,
            chat,
            dispatch ,
            records
          }) => 
          <div>
            <LoadingBar 
              records = {records}
            />
            <RouteHandler 
              universe={universe}
              universes={universes}
              inventory={inventory}
              topic={topic}
              chat={chat}
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