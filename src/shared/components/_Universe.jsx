import React          from 'react';
import Inventory      from './Inventory.jsx';
import Menu           from './Menu.jsx';
import Chat           from './Chat.jsx';

import connectToStores from 'flummox/connect';

class _Universe extends React.Component {
  /*constructor(props) {
    super(props);
    this.state = UniverseStore.getState();
  }

  componentDidMount() {
    UniverseStore.listen(this.onChange);
  }

  componentWillUnmount() {
    UniverseStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }*/
  
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


export default _Universe;