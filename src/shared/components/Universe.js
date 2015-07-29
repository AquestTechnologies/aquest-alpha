import React          from 'react';
import Inventory      from './Inventory';
import {RouteHandler} from 'react-router';
import Menu           from './universe/Menu';
import Chat           from './universe/Chat';
import simpleMerge    from '../utils/simpleMerge';
import menuScroll     from '../../client/lib/menuScroll';
import config         from '../../../config/client';

export default class Universe extends React.Component {
  
  // Loads initial data
  static runPhidippides(routerState) {
    const tasks = [{
      id:         'universe',
      creator:    'readUniverse',
      args:       [routerState.params.universeId]
    },{
      id:         'chat',
      dependency: routerState.params.topicId ? 'topic' : 'universe',
      creator:    'readChat',
      args:       ['__dependency.chatId']
    }];
    const inventory = {
      id:         'inventory',
      dependency: 'universe',
      creator:    'readInventory',
      args:       ['__dependency.id']
    };
    return routerState.params.topicId ? tasks : tasks.concat(inventory);
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
    const {router, universes, params, children, readInventory, readTopicContent, createTopic, transitionTo} = this.props;
    const {universeId, topicId} = params;
    const universe = universes[universeId];
    const topics   = this.filterTopics(this.props.topics, universeId);
    const topic    = topicId ? topics[topicId] : undefined;
    const chatId   = topicId ? topic.chatId : universe.chatId;
    
    return (
      <div> 
        <Menu 
          topicId     ={topicId}
          universeId  ={universeId} 
          universeName={universe.name} 
          pathName    ={router.pathname}
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
          chat    ={this.props.chats[chatId]} 
          readChat={this.props.readChat} //passer les actions par le context, a faire
        />
      </div>
    );
  }
}
