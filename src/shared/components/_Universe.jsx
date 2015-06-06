import React          from 'react';
import Inventory      from './Inventory.jsx';
import Menu           from './Menu.jsx';
import Chat           from './Chat.jsx';

import FluxComponent from 'flummox/component';

class _Universe extends React.Component {
  
  static async routerWillRun({flux}) {
    console.log('... _Universe.routerWillRun');
    if(!flux._stores.universeStore.state.currentUniverse) {
      console.log('... _Universe.routerWillRun running');
      const universeActions = flux.getActions('universeActions');
      await universeActions.loadStartUniverse();
      const topicActions = flux.getActions('topicActions');
      await topicActions.loadCurrentTopics(flux._stores.universeStore.state.currentUniverse.id);
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