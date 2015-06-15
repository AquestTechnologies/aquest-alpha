import React      from 'react';
import {RouteHandler}      from 'react-router';

import Menu       from './universe/Menu.jsx';
import Chat       from './universe/Chat.jsx';
import Inventory  from './universe/Inventory.jsx';

class Universe extends React.Component {
  
  // Load les données initiales
  static runPhidippides(routerState) {
    let userStartUniverseId = 0;
    let root = routerState.pathname === '/' ? true : false;
    let correctCreator = root ? 'loadUniverse' : 'loadUniverseByName';
    let correctArgs = root ? [userStartUniverseId] : [routerState.params.universeName];
    let correctValue = root ? {id: userStartUniverseId} : {name: routerState.params.universeName};
    return [{
      taskName: 'universe',
      dependency: null,
      shouldBePresent: {
        store: 'universeStore',
        data: 'universe',
        shouldHaveValue: correctValue
      },
      ifNot: {
        actions: 'universeActions',
        creator: correctCreator,
        args : correctArgs
      }
    }];
  }
  
  render() {
    let topicActions = this.props.flux.getActions('topicActions');
    let chatActions = this.props.flux.getActions('chatActions');
    
    let actions = {
       loadInventory: topicActions.loadInventory,
       loadChat: chatActions.loadChat,
    };
    
    return (
      <div>
        <Menu />
        <RouteHandler 
          universe={this.props.universe} 
          inventory={this.props.inventory} 
          chat={this.props.chat} 
          actions={actions} 
        />
      </div>
    );
  }
}

Universe.defaultProps = {
  universe: {}
};

export default Universe;