import React from 'react';
import Message from './Message';
import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';

export default class Chat extends React.Component {
  
  constructor() {
    super();
  }
  
  componentWillMount() {
    // console.log('.C. Chat.componentWillMount');
    /*let { chat, readChat, chatId } = this.props;
    let isLoading = false;
    if (!chat) {
      chat = {};
      isLoading = true;
      readChat(chatId);
    }
    this.setState({chat, isLoading});*/
    console.log('.C. Chat.componentWillMount');
    // const socket = io.connect('http://23.251.143.127:9090/chat-universe-topic');
    // this.setState({socket});
    
    const {chatId, chat, userId, readChat, joinChat, socket} = this.props;
    // const {readChat, joinChat} = this.props.actions;
    // this.setState({chat});
    readChat(chatId);
    joinChat({chatId, userId, socket});
  }
  
  componentWillReceiveProps(nextProps) {
    // console.log('.C. Chat.componentWillReceiveProps');
    /*const { chat, readChat, chatId } = nextProps;
    const isLoading = false;
    if (!chat) {
      if (!this.state.isLoading) {
        readChat(chatId);
        this.setState({ 
          chat: {},
          isLoading: true
        });
      }
    } 
    else this.setState({ chat, isLoading });*/
    console.log('.C. Chat.componentWillReceiveProps');
    
    const {chatId, chat, userId, readChat, leaveChat, joinChat, socket} = this.props;
    const nextChatId = nextProps.chatId;
    const nextChat = nextProps.chat;
    // const {leaveChat, joinChat} = this.props.actions;
    
    console.log('propsChatId', chatId, 'nextProps', nextChatId);
    console.log('propsChat', chat, 'nextProps', nextChat);
    
    // if( !this.state.isLoading && nextProps.chatId && chatId !== nextProps.chatId){
    if ( chatId && nextChatId && chatId !== nextChatId ) {
      console.log('chat has changed');
      readChat(nextProps.chatId);
      
      leaveChat({chatId, userId, socket});
      joinChat({chatId: nextChatId, userId, socket});
    }
    
    console.log('messages', chat ? chat.messages : false,'nextMessages', nextChat ? nextChat.messages : false);
    // prevent multiple render
    // if (chat && nextChat && ((!chat.messages && nextChat.messages) || (chat.messages && nextChat.messages && chat.messages.length < nextChat.messages.length)) ) {
    //   console.log('chat has changed, it will rerender');
    //   this.setState({chat: nextChat});
    // }
  }
  
  componentDidMount() {
    //permet de scroller les messages tout en bas après le mount.
    // console.log('.C. Chat mount');
    setTimeout(() => { // Pourquoi un timeout de merde ? Pke sans ça chrome le fait pas ! 
      let scrollable = document.getElementById('scrollMeDown');
      scrollable.scrollTop = scrollable.scrollHeight;
    }, 100);
    
    // const {receiveJoinChat, receiveLeaveChat, receiveMessage} = this.props.actions;
    const {receiveJoinChat, receiveLeaveChat, receiveMessage, socket} = this.props;
    // const {socket} = this.state;
    // const socket = io.connect('http://23.251.143.127:9090/chat-universe-topic');
    // console.log('chat !');
    // this.setState({socket}); 
    
    
    socket.on('receiveMessage', result => receiveMessage(result) );
    socket.on('receiveJoinChat', result => receiveJoinChat(result));
    socket.on('receiveLeaveChat', result => receiveLeaveChat(result));
  }
  
  componentDidUpdate() {
    // console.log('.C. Chat update');
    //permet de scroller les messages tout en bas après avoir reçu de nouveaux props.
    let scrollable       = document.getElementById('scrollMeDown');
    scrollable.scrollTop = scrollable.scrollHeight;
  }
  
  componentWillUnmount(){
    console.log('will unmount');
    const {chatId, userId, leaveChat, socket} = this.props;
    // const {socket} = this.state;
    // const {leaveChat} = this.props.actions;
    // const socket = this.state.socket;
    
    leaveChat({chatId, userId, socket});
    socket.removeListener('receiveMessage');
    socket.removeListener('receiveJoinChat');
    socket.removeListener('receiveLeaveChat');
  }
  
  render() {
    const {chatId, users, createMessage, userId, socket} = this.props;
    // const chat     = this.state.chat || {};
    const chat     = this.props.chat || {};
    const messages = (chat && chat.messages && chat.messages.length) ? chat.messages : []; // l'idéale est d'avoir une requête qui renvoi tableau vide s'il n'y a pas de message.
    const samuel   = "The path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of darkness, for he is truly his brother's keeper and the finder of lost children. And I will strike down upon thee with great vengeance and furious anger those who would attempt to poison and destroy My brothers. And you will know My name is the Lord when I lay My vengeance upon thee.";
    const messagesList = messages.length ? 'chat_list-visible' : 'chat_list-hidden';
    
    return (
      <div className='chat'>
        <ChatHeader chatTitle={chat.name} />
        
        <div id='scrollMeDown' className='chat_scrollable'>
          <div className={messagesList}>
          
            <Message author='Extreme firster' content='First!' />
            {messages.map(message => { 
              return <Message key={message.id} author={message.author} content={message.content.text} />;
            })}
            <Message author='Jackie Chan' content='I live in the USA' />
            <Message author={chat.name + ' L. Jackson'} content={samuel}/>
            
          </div>
        </div>
          
        <ChatFooter
          chatId              = {chatId}
          users               = {users}
          createMessage       = {createMessage}
          userId              = {userId}
          socket              = {socket}
        />
      </div>
    );
  }
}
