import React from 'react';
import Message from './Message.jsx';
import ChatHeader from './ChatHeader.jsx';
import ChatFooter from './ChatFooter.jsx';

class Chat extends React.Component {
  
  componentDidMount() {
    //permet de scroller les messages tout en bas après le mount.
    var scrollable = document.getElementById("scrollMeDown");
    scrollable.scrollTop = scrollable.scrollHeight;
  }
  
  componentDidUpdate() {
    //permet de scroller les messages tout en bas après avoir reçu de nouveaux props.
    var scrollable = document.getElementById("scrollMeDown");
    scrollable.scrollTop = scrollable.scrollHeight;
  }
  
  render() {
    let samuel = "The path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of darkness, for he is truly his brother's keeper and the finder of lost children. And I will strike down upon thee with great vengeance and furious anger those who would attempt to poison and destroy My brothers. And you will know My name is the Lord when I lay My vengeance upon thee.";
    let messagesList = this.props.chat.messages.length === 0 ? 'chat_list_hidden' : 'chat_list_visible';
    if ( this.props.c === 1 ) { messagesList += ' no_animation'; }
    
    return (
      <div className="chat">
        <ChatHeader chatTitle={this.props.chat.name} />
        
          <div id="scrollMeDown" className="chat_scrollable">
            <div className={messagesList}>
            
              <Message author="Extreme firster" content="First!" />
              {this.props.chat.messages.map( (message) => { 
                return <Message key={message.id} author={message.author} content={message.content} />;
              })}
              <Message author="Jackie Chan" content="I live in the USA" />
              <Message author={this.props.chat.name + " L. Jackson"} content={samuel}/>
              
            </div>
          </div>
          
        <ChatFooter />
      </div>
    );
  }
}

Chat.defaultProps = {
  chat: {}
};

export default Chat;