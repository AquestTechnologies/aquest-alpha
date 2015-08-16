import React from 'react';
import Message from './Message';
import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';

export default class Chat extends React.Component {
  
  constructor() {
    super();
    this.state = { 
      chat:      new Map(),
      isLoading: false
    };
  }
  
  componentWillMount() {
    // console.log('.C. Chat.componentWillMount');
    let { chat, readChat, chatId } = this.props;
    let isLoading = false;
    if (!chat) {
      chat = new Map();
      isLoading = true;
      readChat(chatId);
    }
    this.setState({chat, isLoading});
  }
  
  componentWillReceiveProps(nextProps) {
    // console.log('.C. Chat.componentWillReceiveProps');
    const { chat, readChat, chatId } = nextProps;
    const isLoading = false;
    if (!chat) {
      if (!this.state.isLoading) {
        readChat(chatId);
        this.setState({ 
          chat: new Map(),
          isLoading: true
        });
      }
    } 
    else this.setState({ chat, isLoading });
  }
  
  componentDidMount() {
    //permet de scroller les messages tout en bas après le mount.
    // console.log('.C. Chat mount');
    setTimeout(() => { // Pourquoi un timeout de merde ? Pke sans ça chrome le fait pas ! 
      let scrollable = document.getElementById('scrollMeDown');
      scrollable.scrollTop = scrollable.scrollHeight;
    }, 100);
  }
  
  componentDidUpdate() {
    // console.log('.C. Chat update');
    //permet de scroller les messages tout en bas après avoir reçu de nouveaux props.
    let scrollable       = document.getElementById('scrollMeDown');
    scrollable.scrollTop = scrollable.scrollHeight;
  }
  
  render() {
    const { chat } = this.state;
    const messages = chat.has('messages') ? chat.get('messages').toJS() : []; // Bon courage !
    const samuel = "The path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of darkness, for he is truly his brother's keeper and the finder of lost children. And I will strike down upon thee with great vengeance and furious anger those who would attempt to poison and destroy My brothers. And you will know My name is the Lord when I lay My vengeance upon thee.";
    const messagesList = messages.length ? 'chat_list-visible' : 'chat_list-hidden';
    
    return (
      <div className='chat'>
        <ChatHeader chatTitle={chat.get('name')} />
        
        <div id='scrollMeDown' className='chat_scrollable'>
          <div className={messagesList}>
          
            <Message author='Extreme firster' content='First!' />
            { messages.map(msg => <Message key={msg.id} author={msg.userId} content={msg.content} />) }
            <Message author='Jackie Chan' content='I live in the USA' />
            <Message author={chat.get('name') + ' L. Jackson'} content={samuel}/>
            
          </div>
        </div>
          
        <ChatFooter />
      </div>
    );
  }
}
