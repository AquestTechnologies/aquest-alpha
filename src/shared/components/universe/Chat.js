import React from 'react';
import Message from './Message';
import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';
import { bindActionCreators } from 'redux';
import { joinChat, leaveChat, readChatOffset } from '../../actionCreators';
import { connect } from 'react-redux';

class Chat extends React.Component {
  
  constructor() {
    super();
    
    this.state = { isLoading: false };
    
    this.handleScroll = e => {
      const {chatId, chat, readChatOffset} = this.props;
      const {isLoading} = this.state;
      
      if(!isLoading && e.target.scrollTop === 0 && chat.firstMessageId !== chat.messages[0].id ) {
        readChatOffset({chatId, offset: chat.messages.length});
        this.setState({isLoading: true});
      }
    };
    
    this.handleResize = e => { console.log('jey'); console.log(e.targert);};
  }
  
  componentWillMount() {
    console.log('.C. Chat.componentWillMount');
    
    const {chatId, chat, readChat, readChatOffset} = this.props;
    
    if (chat && chat.messages.length) {
      let messageIndex = chat.messages.length - 1;
      while(typeof chat.messages[messageIndex].id === 'string' && (chat.messages[messageIndex].id.substr(0,2) === 'lc' || chat.messages[messageIndex].id.substr(0,2) === 'fe')) { // feelFreeToSignUp --> for fun when a user send a message and isn't authenticated
        messageIndex--;
      }
      readChatOffset({ chatId, offset: chat.messages[messageIndex].id });
    }
    else {
      readChat(chatId);
    }
    
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
    
      leaveChat(chatId);
      joinChat(nextChatId);
    }
    
    if (chat.messages.length < nextChat.messages.length) this.setState({isLoading: false});
  }
  
  componentDidMount() {
    //permet de scroller les messages tout en bas après le mount.
    console.log('.C. Chat mount');
    
    const {chatId, joinChat} = this.props;
    joinChat(chatId);
    
    setTimeout(() => { // Pourquoi un timeout de merde ? Pke sans ça chrome le fait pas ! 
      let scrollable = document.getElementById('scrollMeDown');
      scrollable.scrollTop = scrollable.scrollHeight;
    }, 100);
  }
  
  componentDidUpdate() {
    console.log('.C. Chat update');
  }
  
  componentWillUnmount(){
    const {chatId, leaveChat} = this.props;
    leaveChat(chatId);
  }
  
  render() {
    const {chatId, users} = this.props;
    const chat     = this.props.chat || {};
    const messages = chat.messages || [];
    const messagesList = messages.length ? 'chat_list-visible' : 'chat_list-hidden';
    
    return (
      <div className='chat'>
        <ChatHeader chatName={chat.name} />
        
        <div id='scrollMeDown' className='chat_scrollable' onScroll={this.handleScroll} onResize={this.handleResize}>
          <div className={messagesList}>
            
            { messages.map(({id, userId, type, content, createdAt}) => <Message key={id} id={id} createdAt={createdAt} userId={userId} type={type} content={content} />) }
            
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
  readChatOffset
}, dispatch);

export default connect(mapState, mapActions)(Chat);
