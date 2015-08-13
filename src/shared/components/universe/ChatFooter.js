import React from 'react';
import {randomInteger} from '../../utils/randomGenerators';

export default class ChatFooter extends React.Component {
  
  constructor() {
    super();
    this.handleChange = e => this.setState({value: e.currentTarget.value});
    this.state = {
      value: 'Press Enter to discuss'
    };
    this.handleSubmit = e => {
      e.preventDefault();
      
      const messageParams = {
        id:       randomInteger(0, 1000000),
        chatId:   this.props.chatId,
        userId:   this.props.userId,
        content:  {type: 'text', text: this.state.value},
        socket:   this.props.socket
      };
      
      this.props.createMessage(messageParams);
    };
  }
  
  render() {
    var {value} = this.state;
    return (
      <div className="chatFooter">
        <form className='chatForm' onSubmit={this.handleSubmit}>
          <textarea value={value} onChange={this.handleChange} className="chatFooter_input"/>
          <div className="chat_submit">
            <input type='submit' value='send' />
          </div>
        </form>
      </div>
    );
  }
}
