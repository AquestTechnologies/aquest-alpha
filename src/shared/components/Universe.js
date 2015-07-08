import React          from 'react';
import {RouteHandler} from 'react-router';

import Menu           from './universe/Menu';
import Chat           from './universe/Chat';

import * as universesActions from '../actions/universesActions';
import * as chatsActions from '../actions/chatsActions';
import * as topicsActions from '../actions/topicsActions';

class Universe extends React.Component {
  
  // Load les données initiales
  /*static runPhidippides(routerState) {
    let root              = routerState.pathname === '/' ? true : false;
    let correctHandle     = root ? 'Startups' : routerState.params.universeHandle;
    let correctDependency = routerState.params.topicHandle ? 'topic.topic' : 'universe.universe';
    return [{
      on:              ['server', 'client'],
      shouldBePresent: 'universes.' + correctHandle,
      shouldHaveValue: {handle: correctHandle},
      ifNot:           ['universesActions.loadUniverseByHandle', [correctHandle]]  
    },{
      on:              ['server'],
      shouldBePresent: 'chat.chat',
      dependency:      correctDependency,
      ifNot:           ['chatsActions.loadChat', ['__dependency.chatId']]
    }];
  }*/
  
  static runPhidippides(routerState, fluxState, dispatch) {
    return new Promise((resolve, reject) => {
      if (fluxState.universes[fluxState.globals.universeId] === undefined) {
        
        const correctHandle = routerState.pathname === '/' ? 'Startups' : routerState.params.universeHandle;
        const action1 = universesActions.loadUniverseByHandle(correctHandle);
        dispatch(action1);
        
        action1.promise.then(data => {
          // console.log('resolved !!!');
          // console.log(data);
          const action2 = chatsActions.loadChat(data.chatId);
          const action3 = topicsActions.loadInventory(data.id);
          dispatch(action2);
          dispatch(action3);
          
          Promise.all([ //Phidippides :'(
            action2.promise,
            action3.promise,
          ]).then(() => resolve());
        });
      } else {
        
        resolve();
      }
    });
  }
  
  render() {
    // console.log('universes :');
    // console.log(this.props.universes);
    // console.log('universe :');
    const globals  = this.props.globals;
    const chat     = this.props.chats[globals.chatId];
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
                globals={globals}
                universe={universe} 
                topics={this.props.topics}
                setTopic={this.props.setTopic}
                loadTopicContent={this.props.loadTopicContent} //passer les actions par le context, a faire
                //loadInventory={this.props.loadInventory} //passer les actions par le context, a faire
              />
            </div>
          </div>
        </div>
        
        <Chat 
          chat={chat} 
          //chatId={correctChatId} 
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