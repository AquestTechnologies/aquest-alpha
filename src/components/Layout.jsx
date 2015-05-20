import React from 'react';
import Menu from './Menu.jsx';
import Inventory from './Inventory.jsx';
import Chat from './Chat.jsx';

class Layout extends React.Component {
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

export default Layout;