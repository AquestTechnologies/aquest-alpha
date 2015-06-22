import React                from 'react';
import {RouteHandler}       from 'react-router';

import {bindActionCreators} from 'redux';
import {Connector}          from 'redux/react';

import * as universeActions from '../actions/universeActions';
import * as chatActions     from '../actions/chatActions';

import LoadingBar           from './common/LoadingBar.jsx';

function select(state) {
  return { 
    universe:           state.universe.universe,
    universes:          state.universe.universes,
    inventory:          state.topic.inventory,
    topic:              state.topic.topic,
    chat:               state.chat.chat,
    universeIsLoading:  state.universe.universeIsLoading,
    universesIsLoading: state.universe.universesIsLoading,
    inventoryIsLoading: state.topic.inventoryIsLoading,
    topicIsLoading:     state.topic.topicIsLoading,
    chatIsLoading:      state.chat.chatIsLoading,
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
            universeIsLoading,
            universesIsLoading,
            inventoryIsLoading,
            topicIsLoading,
            chatIsLoading,
            dispatch 
          }) => 
          <div>
            <LoadingBar 
              universeIsLoading={universeIsLoading}
              universesIsLoading={universesIsLoading}
              inventoryIsLoading={inventoryIsLoading}
              topicIsLoading={topicIsLoading}
              chatIsLoading={chatIsLoading}
            />
            <RouteHandler 
              universe={universe}
              universes={universes}
              inventory={inventory}
              topic={topic}
              chat={chat}
              {...bindActionCreators(universeActions, dispatch)} 
              {...bindActionCreators(chatActions, dispatch)} 
            />
          </div>
        }
      </Connector>
    );
  }
}