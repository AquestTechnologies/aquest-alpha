import React from 'react';
import Message from './Message';
import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';

export default class Chat extends React.Component {
  
  constructor() {
    super();
    
    this.state = { isLoading: false };
    
    this.handleScroll = e => {
      const {chatId, chat, readChatOffset} = this.props;
      const {isLoading} = this.state;
      const messages = (chat || []).messages || [];
      
      if ( !isLoading && messages.length && e.target.scrollTop === 0 && chat.firstMessageId !== messages[0].id ) {
        // NOTE : we might want keep this info in the state to avoid recompute this value
        let originalMessageLength = messages.length;
      
        //fastest method
        for (let i=0, messagesLength = messages.length ; i < messagesLength ; i++) {
          if (typeof messages[i].id === 'string' && (messages[i].id.substr(0,2) === 'lc' || messages[i].id.substr(0,2) === 'fe')) {
            originalMessageLength--;
          }
        }
        readChatOffset({chatId, offset: originalMessageLength});
        this.setState({isLoading: true});
      }
    };
  }
  
  componentWillReceiveProps(nextProps) {
    // console.log('.C. Chat.componentWillReceiveProps');
    
    const {chatId, chat, readChat, readChatFromMessage, emitJoinChat, emitLeaveChat} = this.props;
    const messages = (chat || {}).messages || [];
    
    const nextChatId = nextProps.chatId;
    const nextMessages = (nextProps.chat || {}).messages || [];
    
    if ( chatId && nextChatId && chatId !== nextChatId ) {
      if (!nextMessages || !nextMessages.length ) { 
        readChat(nextProps.chatId);
      } else if (nextMessages.length) {
        readChatFromMessage({chatId: nextProps.chatId, messageId: nextMessages[nextMessages.length - 1].id});
      }
    
      emitLeaveChat(chatId);
      emitJoinChat(nextChatId);
    }
    
    if (messages.length && nextMessages.length && messages.length < nextMessages.length) this.setState({isLoading: false});
  }
  
  componentDidMount() {
    //permet de scroller les messages tout en bas après le mount.
    // console.log('.C. Chat mount');
    
    const {chatId, chat, readChat, readChatOffset, emitJoinChat} = this.props;
    const messages = (chat || {}).messages || [];
    
    if (messages && messages.length) {
      if (chat.firstMessageId !== messages[0].id) { 
        // NOTE : we might want keep this info in the state to avoid recompute this value
        let originalMessageLength = messages.length;
      
        //fastest method
        for (let i=0, messagesLength = messages.length ; i < messagesLength ; i++) {
          if (typeof messages[i].id === 'string' && (messages[i].id.substr(0,2) === 'lc' || messages[i].id.substr(0,2) === 'fe')) {
            originalMessageLength--;
          }
        }
        readChatOffset({ chatId, offset: originalMessageLength });
      }
    }
    else readChat(chatId);
    
    emitJoinChat(chatId);
    
    setTimeout(() => { // Pourquoi un timeout de merde ? Pke sans ça chrome le fait pas ! 
      let scrollable = document.getElementById('scrollMeDown');
      scrollable.scrollTop = scrollable.scrollHeight;
    }, 100);
    
    React.findDOMNode(this.refs.scrollMeDown).addEventListener('scroll', this.handleScroll);
  }
  
  componentDidUpdate(prevProps, prevState) {
    // console.log('.C. Chat update');
    
    const {chat} = this.props;
    let scrollable = document.getElementById('scrollMeDown');
    
    var messages = (chat || []).messages || [];
    
    // scrolldown if the user sends a message
    if (chat && prevProps.chat && chat.id !== prevProps.chat.id) scrollable.scrollTop = scrollable.scrollHeight;
    else if (messages && messages.length && typeof messages[messages.length - 1].id === 'string' && messages[messages.length - 1].id.substr(0,2) === 'lc' ) {
      scrollable.scrollTop = scrollable.scrollHeight;
    }
  }
  
  componentWillUnmount(){
    const {chatId, emitLeaveChat} = this.props;
    emitLeaveChat(chatId);
    React.findDOMNode(this.refs.scrollMeDown).removeEventListener('scroll', this.handleScroll);
  }
  
  render() {
    const { 
      chatId, users, chat, emitCreateMessage, 
      emitCreateVoteMessage, sessionUserId, voteContextId, ballot
    } = this.props;
    
    const name     = (chat || '').name || '';
    const messages = (chat || []).messages || [];
    const messagesList = messages.length ? 'chat_list-visible' : 'chat_list-hidden';
    
    return (
      <div className='chat'>
        <ChatHeader chatName={name} />
        
        <div ref='scrollMeDown' id='scrollMeDown' className='chat_scrollable'>
          <div className={messagesList}>
            
            { messages.map(({id, userId, type, content, createdAt, vote}, index) => 
              <Message 
                id={id} 
                key={id}
                vote={vote}
                type={type}
                ballot={ballot}
                chatId={chatId}
                userId={userId} 
                content={content} 
                messageIndex={index}
                createdAt={createdAt} 
                sessionUserId={sessionUserId}
                voteContextId={voteContextId}
                emitCreateVoteMessage={emitCreateVoteMessage}
              />) 
            }
            
          </div>
        </div>
          
        <ChatFooter
          users={users}
          chatId={chatId}
          emitCreateMessage={emitCreateMessage}
        />
      </div>
    );
  }
}
