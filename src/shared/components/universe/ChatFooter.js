import React from 'react';

class ChatFooter extends React.Component {
  
  constructor() {
    super();
    this.state = {value: 'Press Enter to discuss'};
    this.handleChange = (event) => this.setState({value: event.target.value});
  }
  
  render() {
    var value = this.state.value;
    return (
      <div className="chatFooter">
        <textarea value={value} onChange={this.handleChange} className="chatFooter_input"/>
      </div>
    );
  }
}

export default ChatFooter;