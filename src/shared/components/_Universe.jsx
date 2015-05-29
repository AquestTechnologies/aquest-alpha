import React          from 'react';
import Inventory      from './Inventory.jsx';
import Menu           from './Menu.jsx';
import Chat           from './Chat.jsx';
//import UniverseStore  from '../stores/UniverseStore.js';

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
        <Inventory />
        <Chat />
      </div>
    );
  }
}

export default _Universe;