import React from 'react';
import Message from './Message';
import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';
import { bindActionCreators } from 'redux';
import { readChat, joinChat, leaveChat, receiveJoinChat } from '../../actionCreators';
import { connect } from 'react-redux';
// import websocket from 'socket.io-client';

class Chat extends React.Component {
  
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
    
    const {chatId, userId, readChat, joinChat} = this.props;
    // const {readChat, joinChat} = this.props.actions;
    // this.setState({chat});
    readChat(chatId);
    joinChat({chatId, userId});
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
    
    // const {chatId, chat, userId, readChat, leaveChat, joinChat, socket} = this.props;
    const {chatId, chat, userId, readChat, joinChat, leaveChat} = this.props;
    const nextChatId = nextProps.chatId;
    const nextChat = nextProps.chat;
    // const {leaveChat, joinChat} = this.props.actions;
    
    console.log('propsChatId', chatId, 'nextProps', nextChatId);
    console.log('propsChat', chat, 'nextProps', nextChat);
    
    // if( !this.state.isLoading && nextProps.chatId && chatId !== nextProps.chatId){
    if ( chatId && nextChatId && chatId !== nextChatId ) {
      console.log('chat has changed');
      readChat(nextProps.chatId);
      
      leaveChat({chatId, userId});
      joinChat({chatId: nextChatId, userId});
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
    // const {receiveJoinChat, receiveLeaveChat, receiveMessage, socket} = this.props;
    // const {socket} = this.state;
    // const socket = websocket.connect('http://23.251.143.127:9090/chat-universe-topic');
    // socket.on('receiveJoinChat', result => receiveJoinChat(result));
    // console.log('chat !');
    // this.setState({socket}); 
    
    
  }
  
  componentDidUpdate() {
    // console.log('.C. Chat update');
    //permet de scroller les messages tout en bas après avoir reçu de nouveaux props.
    let scrollable       = document.getElementById('scrollMeDown');
    scrollable.scrollTop = scrollable.scrollHeight;
  }
  
  componentWillUnmount(){
    console.log('will unmount');
    // const {chatId, userId, leaveChat, socket} = this.props;
    const {chatId, userId, leaveChat} = this.props;
    // const {socket} = this.state;
    // const {leaveChat} = this.props.actions;
    // const socket = this.state.socket;
    
    // leaveChat({chatId, userId, socket});
    leaveChat({chatId, userId});
  }
  
  render() {
    // const {chatId, users, createMessage, userId, socket} = this.props;
    const {chatId, users, userId} = this.props;
    // const chat     = this.state.chat || {};
    const chat     = this.props.chat || {};
    const messages = chat.messages || [];
    const samuel   = "The path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of darkness, for he is truly his brother's keeper and the finder of lost children. And I will strike down upon thee with great vengeance and furious anger those who would attempt to poison and destroy My brothers. And you will know My name is the Lord when I lay My vengeance upon thee.";
    const messagesList = messages.length ? 'chat_list-visible' : 'chat_list-hidden';
    
    return (
      <div className='chat'>
        <ChatHeader chatName={chat.name} />
        
        <div id='scrollMeDown' className='chat_scrollable'>
          <div className={messagesList}>
            
            <Message userId='Extreme firster' content={{text: 'First!'}} />
            { messages.map(({id, userId, type, content}) => <Message key={id} userId={userId} type={type} content={content} />) }
            <Message userId='Jackie Chan' content='I live in the USA' />
            <Message userId={chat.name + ' L. Jackson'} content={{text: samuel}}/>
            
          </div>
        </div>
          
        <ChatFooter
          chatId              = {chatId}
          users               = {users}
          userId              = {userId}
        />
      </div>
    );
  }
}

const mapState = state => ({});

const mapActions = dispatch => bindActionCreators({ 
  joinChat,
  leaveChat, 
  readChat,
  receiveJoinChat
}, dispatch);

export default connect(mapState, mapActions)(Chat);
