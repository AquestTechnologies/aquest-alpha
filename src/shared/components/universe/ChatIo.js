import React      from 'react';
import Chat       from './Chat';
import io         from 'socket.io-client';
import docCookies from '../../../client/vendor/cookie';

class ChatIo extends React.Component {
  
  constructor() {
    super();
    this.state = { 
      socket: io.connect('http://23.251.143.127:9090/chat-universe-topic'),
      joinedChat: false
    };
  }
  
  socketCreateMessage(message){
    const messageParams = {
      chatId:         message.chatId,
      userId:         this.state.currentUserId,
      messageContent: message.messageContent
    };
    
    this.socket.emit('createMessage', messageParams);
  }
  
  socketJoinChat(chatId){
    this.setState({joinedChat: true});
    console.log(`join chat ${chatId} called !`);
    // const params = { chatId, userId: this.props.currentUserId };
    
    // this.props.joinChat(params);
    // this.socket.emit('join', params);
  }
  
  socketLeaveChat(chatId){
    console.log(`leave chat ${chatId} called !`);
    const params = { chatId, userId: this.props.currentUserId };
    
    this.props.leaveChat(params);
    this.socket.emit('leave', params);
  }
  
  //wait for component to mount before joining the chat - [It avoids getting messages when you don't have the DOM] !
  componentDidMount() {
    this.socket.on('createMessage', result => this.props.createMessage(result) );
    this.socket.on('joinChat', result => this.props.joinChat(result) );
    this.socket.on('leaveChat', result => this.props.leaveChat(result) );
  }
  
  componentWillUnmount(){
    this.socketLeaveChat(this.props.chatId);
  }
  
  render() {
    const universeId = this.props.params.universeId;
    const topicId    = this.props.params.topicId;
    const universe   = this.props.universes[universeId];
    const topics     = this.filterTopics(this.props.topics, universeId);
    
    return (
      <Chat 
          chatId        = {this.props.chatId}
          users         = {this.props.users}
          chats         = {this.props.chats} 
          readChat      = {this.props.readChat}
          
          joinedChat          = {this.state.joinedChat}
          currentUserId       = {this.props.currentUserId}
          socketJoinChat      = {this.socketJoinChat}
          socketLeaveChat     = {this.socketLeaveChat}
          socketCreateMessage = {this.socketCreateMessage}
        />
    );
  }
}

export default Chat;