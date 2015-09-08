import React                  from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import Menu                   from './universe/Menu';
import Chat                   from './universe/Chat';
import Inventory              from './universe/Inventory';
import config             from '../../../config/dev_shared';
import menuScroll             from '../../client/lib/menuScroll';
import { 
  readUniverse, readInventory, transitionTo,
  readChat, readChatOffset, readChatFromMessage, emitJoinChat, emitLeaveChat, emitCreateMessage,
  emitJoinVote, emitLeaveVote, emitCreateVoteMessage, emitCreateVoteTopic
} from '../actionCreators';

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
  
  componentDidMount() {
    const { universes, readUniverse, params: { universeId } } = this.props;
    if (!universes[universeId]) readUniverse(universeId);
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
      readInventory, transitionTo, 
      readChat, emitJoinChat, emitLeaveChat, readChatOffset, emitCreateMessage,
      emitJoinVote, emitLeaveVote, emitCreateVoteMessage, emitCreateVoteTopic,
      children, location: { pathname }, params: { universeId, topicId },
    } = this.props;
    
    const universe = universes[universeId];
    const topic = topicId ? topics[topicId] : undefined;
    const chatId = universe ? topic ? topic.chatId : universe.chatId : undefined;
    const filteredTopics = !children ? this.createTopicsList(topics, universeId) : undefined;
    const chat = chats[chatId];
    const ballot = universe.ballot;
    
    const voteContextId = topicId ? `topic-${topicId}` : `universe-${universeId}`;
    
    return !universe ? <div>Loading...</div> : (
      <div> 
        <Menu 
          topicId={topicId}
          pathName={pathname}
          universeId={universeId} 
          universeName={universe.name} 
        />
        
        <div className='universe_main' style={{backgroundImage: `url(${universe.picture})`}}>
          <div className='universe_main_scrollable' id='main_scrollable'>
            <div className='universe_main_scrolled'> { 
              
              children ? 
                React.cloneElement(children, {
                  topic,
                  userId,
                  ballot,
                  topicId,
                  universe,
                  emitJoinVote, 
                  emitLeaveVote,
                  voteContextId,
                  emitCreateVoteTopic
                }) 
                :
                <Inventory 
                  ballot={ballot}
                  universe={universe}
                  sessionUserId={userId}
                  universeId={universeId}
                  topicsList={filteredTopics}
                  transitionTo={transitionTo}
                  emitJoinVote={emitJoinVote}
                  emitLeaveVote={emitLeaveVote}
                  voteContextId={voteContextId}
                  readInventory={readInventory}
                  emitCreateVoteTopic={emitCreateVoteTopic}
                />
                
            } </div>
          </div>
        </div>  
        
        <Chat 
          chat={chat} 
          ballot={ballot}
          chatId={chatId}
          userId={userId}
          readChat={readChat}
          sessionUserId={userId}
          universeId={universeId}
          emitJoinChat={emitJoinChat}
          emitLeaveChat={emitLeaveChat}
          voteContextId={voteContextId}
          readChatOffset={readChatOffset}
          emitCreateMessage={emitCreateMessage}
          readChatFromMessage={readChatFromMessage}
          emitCreateVoteMessage={emitCreateVoteMessage}
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
  emitJoinChat,
  emitLeaveChat,
  readChatOffset,
  readChatFromMessage,
  emitCreateMessage,
  emitJoinVote, 
  emitLeaveVote,
  emitCreateVoteMessage,
  emitCreateVoteTopic, 
}, dispatch);

export default connect(mapState, mapActions)(Universe);
