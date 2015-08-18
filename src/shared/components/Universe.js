import React                  from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import Menu                   from './universe/Menu';
import Chat                   from './universe/Chat';
import Inventory              from './universe/Inventory';
import { apiUrl }             from '../../../config/client';
import menuScroll             from '../../client/lib/menuScroll';
import { readUniverse, readInventory, readChat, transitionTo } from '../actionCreators';

class Universe extends React.Component {
  
  static runPhidippides(routerState) {
    const { universeId, topicId } = routerState.params;
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
  
  componentWillMount() {
    const { universes, readUniverse, params: { universeId } } = this.props;
    if (!universes[universeId]) readUniverse(universeId);
  }
  
  componentDidMount() {
    menuScroll('main_scrollable');
  }
  
  createTopicsList(topics, universeId) {
    const list = [];
    for (let key in topics) {
      if (topics.hasOwnProperty(key) && topics[key].universeId === universeId) list.push(topics[key]); 
    }
    return list;
  }
  
  render() {
    // console.log('.C. Universe.render');
    const { 
      universes, topics, chats, userId,
      readInventory, readChat, transitionTo, 
      children, location: { pathname }, params: { universeId, topicId }
    } = this.props;
    
    const universe = universes[universeId];
    const topic = topicId ? topics[topicId] : undefined;
    const chatId = universe ? topic ? topic.chatId : universe.chatId : undefined;
    const filteredTopics = !children ? this.createTopicsList(topics, universeId) : undefined;
    const chat = chats[chatId];
    
    return !universe ? <div>Loading...</div> : (
      <div> 
        <Menu 
          topicId={topicId}
          pathName={pathname}
          universeId={universeId} 
          universeName={universe.name} 
        />
        
        <div className='universe_main' style={{backgroundImage: `url(${apiUrl}/${universe.picture})`}}>
          <div className='universe_main_scrollable' id='main_scrollable'>
            <div className='universe_main_scrolled'> { 
              
              children ? 
                
                React.cloneElement(children, {
                  topic,
                  userId,
                  topicId,
                  universe,
                }) 
                :
                <Inventory 
                  universe={universe}
                  topicsList={filteredTopics}
                  transitionTo={transitionTo}
                  readInventory={readInventory}
                />
                
            } </div>
          </div>
        </div>  
        
        <Chat 
          chatId={chatId}
          chat={chat} 
          readChat={readChat}
        />
      </div>
    );
  }
}

const mapState = state => ({ 
  chats:     state.chats,
  topics:    state.topics,
  universes: state.universes,
  userId:    state.session.userId
});

const mapActions = dispatch => bindActionCreators({ 
  transitionTo,
  readUniverse, 
  readInventory, 
  readChat
}, dispatch);

export default connect(mapState, mapActions)(Universe);
