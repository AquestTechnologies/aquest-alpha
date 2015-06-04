import React          from 'react';
import Inventory      from './Inventory.jsx';
import Menu           from './Menu.jsx';
import Chat           from './Chat.jsx';

import connectToStores from 'flummox/connect';

class _Universe extends React.Component {
  
  render() {
    return (
      <div>
        <Menu />
        <Inventory currentUniverse={this.props.currentUniverse}/>
        <Chat />
      </div>
    );
  }
}

_Universe = connectToStores(_Universe, {
  universeStore: store => ({
    currentUniverse: store.getCurrentUniverse()
  })/*,
  topicStore: store => ({
    topics: store.getAllTopics() //renomer cette fonction
  })*/
});

_Universe.routerWillRun = async function({flux}) {
  console.log('... _Universe.routerWillRun');
  const universeActions = flux.getActions('universeActions');
  return await universeActions.getStartUniverse();
}


export default _Universe;