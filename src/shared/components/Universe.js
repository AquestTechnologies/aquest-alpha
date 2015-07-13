import React          from 'react';
import {RouteHandler} from 'react-router';

import Menu           from './universe/Menu';
import Chat           from './universe/Chat';

class Universe extends React.Component {
  
  // Load les données initiales
  static runPhidippides(routerState) {
    return [{
      id:         'universe',
      creator:    'loadUniverse',
      args:       [routerState.params.universeId]
    },{
      id:         'chat',
      dependency: routerState.params.topicId ? 'topic' : 'universe',
      creator:    'loadChat',
      args:       ['__dependency.chatId']
    }];
  }
  
  filterTopics(topics, universeId) {
    let result = {};
    for (let id in topics) {
      if (topics.hasOwnProperty(id) && topics[id].universeId === universeId) result[id] = topics[id];
    }
    return result;
  }
  
  render() {
    // console.log('.C. Universe.render');
    const universeId = this.props.params.universeId;
    const topicId    = this.props.params.topicId;
    const universe   = this.props.universes[universeId];
    const topics     = this.filterTopics(this.props.topics, universeId);
    const chatId     = topicId ? topics[topicId].chatId : universe.chatId;
    // console.log('topics :',this.props.topics);
    // console.log('universe :', universe);
    // console.log('universes :', this.props.universes);
    
    return (
      <div> 
        <Menu />
        
        <div className='universe_main' style={{backgroundImage: `url(${universe.picture})`}}>
          <div className='universe_main_scrollable'>
            <div className='universe_main_scrolled'>
              <RouteHandler
                topics           = {topics}
                universe         = {universe}
                setTopic         = {this.props.setTopic}
                loadInventory    = {this.props.loadInventory} //passer les actions par le context, a faire
                loadTopicContent = {this.props.loadTopicContent} //passer les actions par le context, a faire
              />
            </div>
          </div>
        </div>  
        
        <Chat 
          chatId   = {chatId}
          chat     = {this.props.chats[chatId]} 
          loadChat = {this.props.loadChat} //passer les actions par le context, a faire
        />
      </div>
    );
  }
}

// à supprimer ?
// Universe.defaultProps = { 
//   universe: {
//     id: 0,
//     name: 'defaultProps name',
//     description: 'defaultProps description',
//     imgPath: '/static/img/pillars_compressed.png',
//     chatId: 0
//   },
//   inventory: {
//     universeId: 0,
//     topics: []
//   },
//   chat: {
//     id: 0,
//     name: 'defaultProps name',
//     messages: []
//   },
//   topic: {
//     id: 0,
//     author: 'defaultProps author',
//     title: 'defaultProps title',
//     content: 'defaultProps content',
//     timestamp: 'defaultProps timestamp'
//   }
// };

export default Universe;