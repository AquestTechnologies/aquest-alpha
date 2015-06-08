import React            from 'react';
import {RouteHandler}   from 'react-router';
import FluxComponent    from 'flummox/component';
import LoadingBar       from './common/LoadingBar.jsx';

class App extends React.Component {
  //ici plein de belles choses ?
  constructor(props) {
    super(props);
    // this.state = {c: 0}; //Provoque une boucle infinie coté client avec les getters de FluxComponent
    this.c = 0;
  }
    
  componentWillReceiveProps() {
    // Ne s'incrémente pas lorsque l'utilisateur navigue vers "back"
    this.c += 1;
  }
  render() {
    return (
      <FluxComponent c={this.c} connectToStores={{
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