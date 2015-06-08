import React            from 'react';
import {RouteHandler}   from 'react-router';
import FluxComponent    from 'flummox/component';
import LoadingBar       from './common/LoadingBar.jsx';

class App extends React.Component {
  //ici plein de belles choses ?

  render() {
    return (
      <FluxComponent c={this.props.c} connectToStores={{
        universeStore: store => ({
          universeIsLoading: store.isLoading(),
          universe: store.getUniverse(),
          universes: store.getAllUniverses()
        }),
        topicStore: store => ({
          topicIsLoading: store.isLoading(),
          topics: store.getTopics()
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