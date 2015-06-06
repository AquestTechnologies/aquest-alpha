import React          from 'react';
import Inventory      from './universe/Inventory.jsx';
import Menu           from './universe/Menu.jsx';
import Chat           from './universe/Chat.jsx';

import FluxComponent from 'flummox/component';

class _Universe extends React.Component {
  
  static async routerWillRun({flux}) {
    if(!flux._stores.universeStore.state.currentUniverse) {
      console.log('... _Universe.routerWillRun running');
      const universeActions = flux.getActions('universeActions');
      await universeActions.loadStartUniverse();
      const topicActions = flux.getActions('topicActions');
      await topicActions.loadCurrentTopics(flux._stores.universeStore.state.currentUniverse.id);
    } else {
      console.log('... _Universe.routerWillRun not running');
    }
  }
  
  render() {
    return (
      <FluxComponent connectToStores={{
        universeStore: store => ({
          universe: store.getCurrentUniverse()
        }),
        topicStore: store => ({
          topics: store.getCurrentTopics()
        })
      }}>
        <Menu />
        <Inventory />
        <Chat />
      </FluxComponent>
    );
  }
}

// _Universe = connectToStores(_Universe, {
//   universeStore: store => ({
//     currentUniverse: store.getCurrentUniverse()
//   })/*,
//   topicStore: store => ({
//     topics: store.getAllTopics() //renomer cette fonction
//   })*/
// });


export default _Universe;