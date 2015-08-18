import React from 'react';
import Message from './Message';
import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';
import { bindActionCreators } from 'redux';
import { readChat, joinChat, leaveChat } from '../../actionCreators';
import { connect } from 'react-redux';
// import websocket from 'socket.io-client';

class Chat extends React.Component {
  
  constructor() {
    super();
  }
  
  componentWillMount() {
    console.log('.C. Chat.componentWillMount');
    
    const {chatId, readChat, joinChat} = this.props;
    readChat(chatId);
    joinChat(chatId);
  }
  
  componentWillReceiveProps(nextProps) {
    console.log('.C. Chat.componentWillReceiveProps');
    
    const {chatId, chat, readChat, joinChat, leaveChat} = this.props;
    const nextChatId = nextProps.chatId;
    const nextChat = nextProps.chat;
    
    console.log('propsChatId', chatId, 'nextProps', nextChatId);
    console.log('propsChat', chat, 'nextProps', nextChat);
    
    if ( chatId && nextChatId && chatId !== nextChatId ) {
      console.log('chat has changed');
      readChat(nextProps.chatId);
      
      leaveChat({chatId});
      joinChat({chatId: nextChatId});
    }
    
    console.log('messages', chat ? chat.messages : false,'nextMessages', nextChat ? nextChat.messages : false);
  }
  
  componentDidMount() {
    //permet de scroller les messages tout en bas après le mount.
    console.log('.C. Chat mount');
    setTimeout(() => { // Pourquoi un timeout de merde ? Pke sans ça chrome le fait pas ! 
      let scrollable = document.getElementById('scrollMeDown');
      scrollable.scrollTop = scrollable.scrollHeight;
    }, 100);
  }
  
  componentDidUpdate() {
    console.log('.C. Chat update');
    //permet de scroller les messages tout en bas après avoir reçu de nouveaux props.
    let scrollable       = document.getElementById('scrollMeDown');
    scrollable.scrollTop = scrollable.scrollHeight;
  }
  
  componentWillUnmount(){
    const {chatId, leaveChat} = this.props;
    leaveChat({chatId});
  }
  
  render() {
    const {chatId, users} = this.props;
    const chat     = this.props.chat || {};
    const messages = chat.messages || [];
    const messagesList = messages.length ? 'chat_list-visible' : 'chat_list-hidden';
    
    return (
      <div className='chat'>
        <ChatHeader chatName={chat.name} />
        
        <div id='scrollMeDown' className='chat_scrollable'>
          <div className={messagesList}>
            
            <Message userId='Extreme firster' content={{text: 'First!'}} />
            { messages.map(({id, userId, type, content}) => <Message key={id} userId={userId} type={type} content={content} />) }
            
          </div>
        </div>
          
        <ChatFooter
          chatId              = {chatId}
          users               = {users}
        />
      </div>
    );
  }
}

const mapState = state => ({});

const mapActions = dispatch => bindActionCreators({ 
  joinChat,
  leaveChat, 
  readChat
}, dispatch);

export default connect(mapState, mapActions)(Chat);
