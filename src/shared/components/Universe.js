import React          from 'react';
import {RouteHandler} from 'react-router';

import Menu           from './universe/Menu';
import Chat           from './universe/Chat';

class Universe extends React.Component {
  
  // Load les données initiales
  static runPhidippides(routerState) {
    const correctHandle     = routerState.pathname === '/' ? 'Startups' : routerState.params.universeHandle;
    const correctDependency = routerState.params.topicHandle ? 'topic' : 'universe';
    return [{
      id:         'universe',
      creator:    'loadUniverseByHandle',
      args:       [correctHandle]
    },{
      id:         'chat',
      dependency: correctDependency,
      creator:    'loadChat',
      args:       ['__dependency.chatId']
    }];
  }
  
  // static runPhidippides(routerState, fluxState, dispatch) {
  //   return new Promise((resolve, reject) => {
  //     if (fluxState.universes.get(fluxState.globals.universeId) === undefined) {
        
  //       const correctHandle = routerState.pathname === '/' ? 'Startups' : routerState.params.universeHandle;
  //       const action1 = actions.loadUniverseByHandle(correctHandle);
  //       dispatch(action1);
        
  //       action1.promise.then(data => {
  //         // console.log('resolved !!!');
  //         // console.log(data);
  //         let todo = [];
  //         if (fluxState.chats.get(fluxState.globals.chatId) === undefined) {
  //           const action2 = actions.loadChat(data.chatId);
  //           dispatch(action2);
  //           todo.push(action2.promise);
  //         }
  //         const action3 = actions.loadInventory(data.id);
  //         dispatch(action3);
  //         todo.push(action3.promise);
  //         Promise.all(todo).then(() => resolve());
  //       });
  //     } else {
  //       if (fluxState.chats.get(fluxState.globals.chatId) === undefined) {
  //         const action2 = actions.loadChat(fluxState.universes.get(fluxState.globals.universeId).chatId);
  //         dispatch(action2);
  //         action2.promise.then(() => resolve());
  //       } else {
  //         resolve();
  //       }
  //     }
  //   });
  // }
  
  render() {
    // console.log('universes :');
    // console.log(this.props.universes);
    // console.log('universe :');
    const globals  = this.props.globals;
    const chatId   = globals.chatId;
    const universe = this.props.universes[globals.universeId];
    // console.log(universe);
    // let correctChatId = this.props.params.topicHandle ? this.props.topic.chatId : universe.chatId;
    
    return (
      <div> 
        <Menu />
        
        <div className="universe_left" style={{backgroundImage: 'url(' + universe.picture + ')'}}>
          <div className="universe_left_scrollable">
            <div className="universe_left_scrolled">
              <RouteHandler
                // globals={globals}
                universe={universe} 
                setTopic={this.props.setTopic}
                loadTopicContent={this.props.loadTopicContent} //passer les actions par le context, a faire
                loadInventory={this.props.loadInventory} //passer les actions par le context, a faire
              />
            </div>
          </div>
        </div>
        
        <Chat 
          chatId={chatId} 
          chat={this.props.chats[chatId]} 
          loadChat={this.props.loadChat} //passer les actions par le context, a faire
        />
      </div>
    );
  }
}

// à supprimer ?
Universe.defaultProps = { 
  universe: {
    id: 0,
    name: 'defaultProps name',
    description: 'defaultProps description',
    imgPath: '/static/img/pillars_compressed.png',
    chatId: 0
  },
  inventory: {
    universeId: 0,
    topics: []
  },
  chat: {
    id: 0,
    name: 'defaultProps name',
    messages: []
  },
  topic: {
    id: 0,
    author: 'defaultProps author',
    title: 'defaultProps title',
    content: 'defaultProps content',
    timestamp: 'defaultProps timestamp'
  }
};

export default Universe;