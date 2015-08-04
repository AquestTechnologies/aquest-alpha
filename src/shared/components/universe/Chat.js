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
    
    if ( Object.getOwnPropertyNames(this.props.chats).length === 0 || (Object.getOwnPropertyNames(this.props.chats).length !== 0 && (!this.props.chats[this.props.chatId] || !this.props.chats[this.props.chatId].isUpToDate)) ) {
      console.log('componenet will mount I\'m gonna readChat');
      this.props.readChat(this.props.chatId);
      this.props.joinChat( {chatId: this.props.chatId, userId: this.props.currentUserId} );
      isLoading = true;
    }
    this.setState({isLoading});
  }
  
  componentWillReceiveProps(nextProps) {
    console.log('.C. Chat.componentWillReceiveProps');
    
    if( nextProps.chatId && this.props.chatId !== nextProps.chatId ){
      console.log('not the same chat');
      if( !nextProps.chats[nextProps.chatId] || ( nextProps.chats[nextProps.chatId] && !nextProps.chats[nextProps.chatId].isUpToDate) ){
        
        console.log('chat change :) !')
        
        nextProps.readChat(nextProps.chatId);
        
        this.props.leaveChat( {chatId: this.props.chatId, userId: this.props.currentUserId} );
        this.props.joinChat( {chatId: nextProps.chatId, userId: this.props.currentUserId} );
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
    const socket = this.state.socket;
    
    this.props.leaveChat({chatId: this.props.chatId, userId: this.props.currentUserId});
    socket.removeListener('createMessage');
    socket.removeListener('joinChat');
    socket.removeListener('leaveChat');
  }
  
  render() {
    const chat          = this.props.chats && this.props.chats[this.props.chatId] ? this.props.chats[this.props.chatId] : {} || {};
    const chatName      = chat ? chat.name : 'loadingChat' || 'loadingChat'; 
    const messages      = (chat && chat.messages && chat.messages[0]) ? chat.messages : []; // l'idéale est d'avoir une requête qui renvoi tableau vide s'il n'y a pas de message.
    // const samuel        = "The path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of darkness, for he is truly his brother's keeper and the finder of lost children. And I will strike down upon thee with great vengeance and furious anger those who would attempt to poison and destroy My brothers. And you will know My name is the Lord when I lay My vengeance upon thee.";
    // <Message author='Jackie Chan' content='I live in the USA' />
    // <Message author={chat.name + ' L. Jackson'} content={samuel}/>
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
          chatId              = {this.props.chatId}
          users               = {this.props.users}
          currentUserId       = {this.props.currentUserId}
          createMessage       = {this.props.createMessage}
        />
      </div>
    );
  }
}

export default Chat;