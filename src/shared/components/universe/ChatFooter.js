import React from 'react';

class ChatFooter extends React.Component {
  
  constructor() {
    super();
    
    // socketio included in index.html <script src="http://<ip>:9090/socket.io/socket.io.js"></script>
    // put io in redux state ? (using it as this.props.io ?)
    this.namespace = 'chat-universe-topic';
    
    this.state = { messageContent: 'Press Enter to discuss' };
    this.handleInputMessage = (e) => this.setState({messageContent: e.target.value});
    this.handleSubmit = e => {
      e.preventDefault();
      const {userId, messageContent} = this.state;
      this.state.id = this.props.chatId;
      this.state.userId = this.props.users[userId].id;
      
      /**
       * TODO :
       * create a function that modify the content to match atom like version 
       * --> [{'atom_type':'sub_content'}] */
      this.state.messageContent = {type: 'text', text: messageContent};
      
      //this is ugly, but it's just a test
      this.state.namespace = this.namespace;
      this.state.socketAction = 'emit';
      
      // sending to the web server over websocket
      this.props.createMessage(this.state);
    };
  }
  
  componentDidMount(){
    this.state.userId = localStorage.getItem('userId');
    
    const socket = io.connect(`http://130.211.59.69:9090/${this.namespace}`);
    
    // sending to the web server over websocket
    this.props.joinChat({
      namespace: this.namespace, 
      socketAction: 'emit', 
      id: this.props.chatId, 
      userId: this.props.users[this.state.userId].id
    });
    
    // recieving from the websocket server part
    socket.on('createMessage', (result) => this.props.createMessage(result));
    socket.on('joinChat', (result) =>{ console.log('joinChat socket.on ',result); this.props.joinChat(result)});
    socket.on('leaveChat', (result) => this.props.leaveChat(result));
  }
  
  componentWillUnmount(){
    
    // sending to the web server over websocket
    this.props.leaveChat({
      namespace: this.namespace, 
      actsocketActionion: 'emit', 
      id: this.props.chatId, 
      userId: this.props.users[this.state.userId].id
    });
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