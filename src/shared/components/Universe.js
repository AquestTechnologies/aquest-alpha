import React          from 'react';
import {RouteHandler} from 'react-router';

import Menu           from './universe/Menu';
import Chat           from './universe/Chat';

class Universe extends React.Component {
  
  // Load les données initiales
  static runPhidippides(routerState) {
    let root              = routerState.pathname === '/' ? true : false;
    let correctArg        = root ? 'Startups' : routerState.params.universeHandle;
    let correctValue      = root ? {handle: 'Startups'} : {handle: routerState.params.universeHandle};
    let correctDependency = routerState.params.topicHandle ? 'topic.topic' : 'universe.universe';
    return [{
      on:              ['server', 'client'],
      shouldBePresent: 'universe.universe',
      shouldHaveValue: correctValue,
      ifNot:           ['universeActions.loadUniverseByHandle', [correctArg]]  
    },{
      on:              ['server'],
      shouldBePresent: 'chat.chat',
      dependency:      correctDependency,
      ifNot:           ['chatActions.loadChat', ['__dependency.chatId']]
    }];
  }
  
  render() {
    let correctChatId = this.props.params.topicHandle ? this.props.topic.chatId : this.props.universe.chatId;
    
    return (
      <div>
        <Menu />
        
        <div className="universe_left" style={{backgroundImage: 'url(' + this.props.universe.picture + ')'}}>
          <div className="universe_left_scrollable">
            <div className="universe_left_scrolled">
              <RouteHandler
                universe={this.props.universe} 
                inventory={this.props.inventory}
                topic={this.props.topic}
                setTopic={this.props.setTopic}
                loadTopicContent={this.props.loadTopicContent} //passer les actions par le context, a faire
                loadInventory={this.props.loadInventory} //passer les actions par le context, a faire
              />
            </div>
          </div>
        </div>
        
        <Chat 
          chat={this.props.chat} 
          chatId={correctChatId} 
          loadChat={this.props.loadChat} //passer les actions par le context, a faire
        />
      </div>
    );
  }
}

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