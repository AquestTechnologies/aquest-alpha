import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createMessage } from '../../actionCreators';

class ChatFooter extends React.Component {
  
  constructor() {
    super();
    this.handleChange = e => this.setState({value: e.currentTarget.value});
    this.state = {
      value: 'Press Enter to discuss'
    };
    this.handleSubmit = e => {
      e.preventDefault();
      
      const messageParams = {
        chatId:   this.props.chatId,
        content:  {type: 'text', text: this.state.value}
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

const mapState = state => ({});

const mapActions = dispatch => bindActionCreators({ createMessage }, dispatch);

export default connect(mapState, mapActions)(ChatFooter);
