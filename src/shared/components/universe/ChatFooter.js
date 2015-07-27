import React from 'react';

class ChatFooter extends React.Component {
  
  constructor() {
    super();
    this.state = {value: 'Press Enter to discuss'};
    this.handleChange = (event) => this.setState({value: event.target.value});
    this.handleSubmit = (event) => {};
  }
  
  render() {
    var value = this.state.value;
    return (
      <div className="chatFooter">
        <form className='chatForm' onSubmit={this.handleSubmit}>
          <textarea value={value} onChange={this.handleChange} className="chatFooter_input"/>
        </form>
      </div>
    );
  }
}

export default ChatFooter;