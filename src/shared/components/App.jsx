import React            from 'react';
import {RouteHandler}   from 'react-router';
import FluxComponent    from 'flummox/component';
import LoadingBar       from './common/LoadingBar.jsx';

class App extends React.Component {
  //ici plein de belles choses ?

  render() {
    return (
      <FluxComponent flux={this.props.flux}
      connectToStores={{
        universeStore: store => ({
          universeIsLoading: store.isLoading(),
          universes: store.getAllUniverses(),
          universe: store.getUniverse()
        }),
        topicStore: store => ({
          topicIsLoading: store.isLoading(),
          inventory: store.getInventory(),
          topic: store.getTopic()
        }),
        chatStore: store => ({
          chatIsLoading: store.isLoading(),
          chat: store.getChat()
        })
      }}>
        <LoadingBar />        
        <RouteHandler />
      </FluxComponent>
    );
  }
}

export default App;