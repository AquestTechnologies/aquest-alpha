import React          from 'react';
import Inventory      from './Inventory';
import Menu           from './universe/Menu';
import Chat           from './universe/Chat';
import config         from '../../../config/client';
import menuScroll     from '../../client/lib/menuScroll';

export default class Universe extends React.Component {
  
  static runPhidippides(routerState) {
    const {universeId, topicId} = routerState.params;
    const tasks = [{
      id:         'universe',
      creator:    'readUniverse',
      args:       [universeId]
    },{
      id:         'chat',
      dependency: topicId ? 'topic' : 'universe',
      creator:    'readChat',
      args:       ['__dependency.chatId']
    }];
    const inventory = {
      id:         'inventory',
      dependency: 'universe',
      creator:    'readInventory',
      args:       ['__dependency.id']
    };
    return topicId ? tasks : tasks.concat(inventory);
  }
  
  filterTopics(topics, universeId) {
    let result = {};
    for (let id in topics) {
      if (topics.hasOwnProperty(id) && topics[id].universeId === universeId) result[id] = topics[id];
    }
    return result;
  }
  
  componentDidMount() {
    menuScroll('main_scrollable');
  }
  
  render() {
    // console.log('.C. Universe.render');
    const {location, universes, chats, params, children, readInventory, readTopicContent, createTopic, readChat, transitionTo} = this.props;
    const {universeId, topicId} = params;
    const universe = universes[universeId];
    const topics   = this.filterTopics(this.props.topics, universeId);
    const topic    = topicId ? topics[topicId] : undefined;
    const chatId   = topic ? topic.chatId : universe.chatId;
    
    return (
      <div> 
        <Menu 
          topicId     ={topicId}
          universeId  ={universeId} 
          universeName={universe.name} 
          pathName    ={location.pathname}
        />
        
        <div className='universe_main' style={{backgroundImage: `url(${config.apiUrl}/${universe.picture})`}}>
          <div className='universe_main_scrollable' id='main_scrollable'>
            <div className='universe_main_scrolled'> { 
              
              children && !(children instanceof Array) ? 
                
                React.cloneElement(children, {
                  topic,
                  universe,
                  createTopic,
                  readTopicContent,
                }) 
                :
                <Inventory 
                  topics       ={topics}
                  universe     ={universe}
                  transitionTo ={transitionTo}
                  readInventory={readInventory}
                />
                
            } </div>
          </div>
        </div>  
        
        <Chat 
          chatId  ={chatId}
          readChat={readChat} //passer les actions par le context, a faire
          chat    ={chats[chatId]} 
        />
      </div>
    );
  }
}
