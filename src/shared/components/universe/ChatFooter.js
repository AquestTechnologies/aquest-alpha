import React from 'react';

class ChatFooter extends React.Component {
  
  constructor() {
    super();
    
    this.state = { messageContent: 'Press Enter to discuss' };
    this.handleInputMessage = (e) => this.setState({messageContent: e.target.value});
    this.handleSubmit = e => {
      e.preventDefault();
      
      const messageParams = {
        chatId:           this.props.chatId,
        userId:           this.props.currentUserId,
        messageContent:   {type: 'text', text: this.state.messageContent}
      };
      
      this.props.createMessage(messageParams);
    };
  }
  
  render() {
    const messageContent = this.state.messageContent;
    return (
      <div className="chatFooter">
        <form className='chatForm' onSubmit={this.handleSubmit}>
          <textarea value={messageContent} onChange={this.handleInputMessage} className="chatFooter_input"/>
          <div className="chat_submit">
            <input type='submit' value='send' />
          </div>
        </form>
      </div>
    );
  }
}

export default ChatFooter;