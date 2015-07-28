import React from 'react';

class ChatFooter extends React.Component {
  
  constructor() {
    super();
    
    this.state = { messageContent: 'Press Enter to discuss' };
    
    this.handleInputMessage = (e) => this.setState({messageContent: e.target.value});
    this.handleSubmit = e => {
      e.preventDefault();
      const {userId, messageContent} = this.state;
      this.state.chatId = this.props.chatId;
      this.state.userId = this.props.users[userId].id;
      /**
       * TODO :
       * create a function that modify the content to match atom like version 
       * --> [{'atom_type':'sub_content'}] */
      this.state.messageContent = {type: 'text', text: messageContent};
      this.props.createMessage(this.state);
    };
  }
  
  componentDidMount(){
    this.setState({userId: localStorage.getItem('userId')});
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