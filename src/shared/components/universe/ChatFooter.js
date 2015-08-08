import React from 'react';

export default class ChatFooter extends React.Component {
  
  constructor() {
    super();
    this.handleChange = (event) => this.setState({value: event.currentTarget.value});
    this.state = {
      value: 'Press Enter to discuss'
    };
  }
  
  render() {
    var {value} = this.state;
    return (
      <div className="chatFooter">
        <textarea value={value} onChange={this.handleChange} className="chatFooter_input"/>
      </div>
    );
  }
}
