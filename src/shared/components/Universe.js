import React          from 'react';
import Inventory      from './universe/Inventory';
import Menu           from './universe/Menu';
import Chat           from './universe/Chat';
import config         from '../../../config/client';
import menuScroll     from '../../client/lib/menuScroll';

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
  
  filterTopics(topics, universeId) {
    let result = {};
    for (let id in topics) {
      if (topics.hasOwnProperty(id) && topics[id].universeId === universeId) result[id] = topics[id];
    }
    return result;
  }
  
  componentWillMount() {
    const { universes, params: { universeId }, actions: { readUniverse } } = this.props;
    if (!universes[universeId]) readUniverse(universeId);
  }
  
  componentDidMount() {
    menuScroll('main_scrollable');
  }
  
  render() {
    // console.log('.C. Universe.render');
    const { 
      universes, topics, chats, session: { userId },
      children, location: { pathname }, params: { universeId, topicId },
      actions: { readInventory, readTopic, readTopicAtoms, readChat, createTopic, transitionTo }
    } = this.props;
    
    const universe = universes[universeId];
    const topic = topicId ? topics[topicId] : undefined;
    const chatId = universe ? topic ? topic.chatId : universe.chatId : undefined;
    const filteredTopics = !children ? this.filterTopics(topics, universeId) : undefined;
    
    return !universe ? <div>Loading...</div> : (
      <div> 
        <Menu 
          topicId={topicId}
          universeId={universeId} 
          universeName={universe.name} 
          pathName={pathname}
        />
        
        <div className='universe_main' style={{backgroundImage: `url(${config.apiUrl}/${universe.picture})`}}>
          <div className='universe_main_scrollable' id='main_scrollable'>
            <div className='universe_main_scrolled'> { 
              
              children && !(children instanceof Array) ? 
                
                React.cloneElement(children, {
                  topic,
                  userId,
                  topicId,
                  universe,
                  readTopic,
                  createTopic,
                  readTopicAtoms,
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
          chatId={chatId}
          readChat={readChat} //passer les actions par le context, a faire
          chat={chats[chatId]} 
        />
      </div>
    );
  }
}

const mapState = (state, props) => ({ 
  universes: state.universes.toJS(),
  chats:     state.chats.toJS(),
  users:     state.users.toJS(),
  session:   state.session,
  router:    state.router,
});

export default Universe;
