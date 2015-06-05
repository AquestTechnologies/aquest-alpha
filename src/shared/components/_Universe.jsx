import React          from 'react';
import Inventory      from './Inventory.jsx';
import Menu           from './Menu.jsx';
import Chat           from './Chat.jsx';

import FluxComponent from 'flummox/component';

class _Universe extends React.Component {
  
  static async routerWillRun({flux}) {
    console.log('... _Universe.routerWillRun');
    const universeActions = flux.getActions('universeActions');
    return await universeActions.getStartUniverse();
  }
  
  render() {
    return (
      <FluxComponent connectToStores={{
        universeStore: store => ({
          currentUniverse: store.getCurrentUniverse()
        }),
        topicStore: store => ({
          topics: store.getAllTopics() //renomer cette fonction
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