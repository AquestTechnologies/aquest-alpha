import React          from 'react';
import Inventory      from './Inventory';
import Menu           from './universe/Menu';
import Chat           from './universe/Chat';
import docCookies     from '../../client/vendor/cookie';
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
  
  componentWillMount() {
    const {universes, params, readUniverse} = this.props;
    const {universeId} = params;
    if (!universes[universeId]) readUniverse(universeId);
  }
  
  componentDidMount() {
    menuScroll('main_scrollable');
  }
  
  render() {
    // console.log('.C. Universe.render');
    const {session, universes, topics, chats, params, location, children, readInventory, readTopic, readTopicContent, readChat, createTopic, transitionTo, users, joinChat, leaveChat, createMessage} = this.props;
    const {universeId, topicId} = params;
    const universe = universes[universeId];
    const topic = topicId ? topics[topicId] : undefined;
    const chatId = universe ? topic ? topic.chatId : universe.chatId : undefined;
    const filteredTopics = !children ? this.filterTopics(topics, universeId) : undefined;
    
    return !universe ? <div>Loading...</div> : (
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
                  readTopic,
                  createTopic,
                  readTopicContent,
                }) 
                :
                <Inventory 
                  topics        = {filteredTopics}
                  universe      = {universe}
                  transitionTo  = {transitionTo}
                  readInventory = {readInventory}
                  session       = {session}
                />
                
            } </div>
          </div>
        </div>  
        
        <Chat 
          chatId        = {chatId}
          users         = {users}
          chats         = {chats} 
          readChat      = {readChat} //passer les actions par le context, a faire
          joinChat      = {joinChat}
          leaveChat     = {leaveChat}
          createMessage = {createMessage}
          session       = {session}
        />
      </div>
    );
  }
}
