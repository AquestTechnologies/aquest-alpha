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
    if (!universes.has(universeId)) readUniverse(universeId);
  }
  
  componentDidMount() {
    menuScroll('main_scrollable');
  }
  
  render() {
    // console.log('.C. Universe.render');
    const { 
      universes, topics, chats, userId,
      readInventory, readChat, transitionTo, 
      children, location: { pathname }, params: { universeId, topicId },
    } = this.props;
    
    const universe = universes.get(universeId);
    const topic = topicId ? topics.get(topicId) : undefined;
    const chatId = universe ? topic ? topic.get('chatId') : universe.get('chatId') : undefined;
    const filteredTopics = !children ? topics.filter(t => t.get('universeId') === universeId) : undefined;
    const chat = chats.get(chatId);
    
    return !universe ? <div>Loading...</div> : (
      <div> 
        <Menu 
          topicId={topicId}
          pathName={pathname}
          universeId={universeId} 
          universeName={universe.get('name')} 
        />
        
        <div className='universe_main' style={{backgroundImage: `url(${apiUrl}/${universe.get('picture')})`}}>
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
                  topics={filteredTopics}
                  transitionTo={transitionTo}
                  readInventory={readInventory}
                />
                
            } </div>
          </div>
        </div>  
        
        <Chat 
          chat={chat} 
          chatId={chatId}
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
  userId:    state.session.userId,
});

const mapActions = dispatch => bindActionCreators({ 
  transitionTo,
  readUniverse, 
  readInventory, 
  readChat,
}, dispatch);

export default connect(mapState, mapActions)(Universe);
