import React      from 'react';
import Message    from './Message';
import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';
import io         from 'socket.io-client';

class Chat extends React.Component {
  
  constructor() {
    super();
    this.state = {
      isLoading:  false
    };
  }
  
  componentWillMount() {
    console.log('.C. Chat.componentWillMount');
    let isLoading = false;
    const {chats, chatId, session} = this.props;
    
    console.log('componenet will mount I\'m gonna readChat');
    this.props.readChat(chatId);
    this.props.joinChat( {chatId, userId: session.userId} );
    isLoading = true;
    
    this.setState({isLoading});
  }
  
  componentWillReceiveProps(nextProps) {
    console.log('.C. Chat.componentWillReceiveProps');
    
    const {chatId, session} = this.props;
    
    if( nextProps.chatId && chatId !== nextProps.chatId ){
      console.log('not the same chat');
      if( !this.state.isLoading && (!nextProps.chats[nextProps.chatId] || ( nextProps.chats[nextProps.chatId] && !nextProps.chats[nextProps.chatId].isUpToDate)) ){
        
        console.log('chat change :) !')
        
        nextProps.readChat(nextProps.chatId);
        
        this.props.leaveChat( {chatId, userId: session.userId} );
        this.props.joinChat( {chatId, userId: session.userId} );
      }
    }
  }
  
  componentDidMount() {
    //permet de scroller les messages tout en bas après le mount.
    // console.log('.C. Chat mount');
    setTimeout(() => { // Pourquoi un timeout de merde ? Pke sans ça chrome le fait pas ! 
      let scrollable = document.getElementById('scrollMeDown');
      scrollable.scrollTop = scrollable.scrollHeight;
    }, 100);
    
    const socket = io.connect('http://23.251.143.127:9090/chat-universe-topic');
    this.setState({socket}); 
    
    
    socket.on('createMessage', result => this.props.createMessage(result) );
    socket.on('joinChat', result => {
      console.log('recieving joinChat from server');
      this.props.joinChat(result) 
    });
    socket.on('leaveChat', result => {
      console.log('recieving leaveChat from server');
      this.props.leaveChat(result) 
    });
  }
  
  componentDidUpdate() {
    // console.log('.C. Chat update');
    //permet de scroller les messages tout en bas après avoir reçu de nouveaux props.
    let scrollable       = document.getElementById('scrollMeDown');
    scrollable.scrollTop = scrollable.scrollHeight;
  }
  
  componentWillUnmount(){
    console.log('will unmount');
    const {chatId, session} = this.props;
    const socket = this.state.socket;
    
    this.props.leaveChat({chatId, userId: session.userId});
    socket.removeListener('createMessage');
    socket.removeListener('joinChat');
    socket.removeListener('leaveChat');
  }
  
  render() {
    const {chatId, users, createMessage, session} = this.props;
    const chat          = this.props.chats && this.props.chats[chatId] ? this.props.chats[chatId] : {};
    const chatName      = chat ? chat.name : 'loadingChat'; 
    const messages      = (chat && chat.messages && chat.messages[0]) ? chat.messages : []; // l'idéale est d'avoir une requête qui renvoi tableau vide s'il n'y a pas de message.
    const messagesList  = messages.length ? 'chat_list-visible' : 'chat_list-hidden';
    
    return (
      <div className='chat'>
        <ChatHeader chatTitle={chatName} />
        
        <div id='scrollMeDown' className='chat_scrollable'>
          <div className={messagesList}>
          
            <Message author='Extreme firster' content='First!' />
            {messages.map(message => { 
              return <Message key={message.id} author={message.userId} content={message.content.text} />;
            })}
            
          </div>
        </div>
          
        <ChatFooter
          chatId              = {chatId}
          users               = {users}
          createMessage       = {createMessage}
          session             = {session}
        />
      </div>
    );
  }
}

export default Chat;