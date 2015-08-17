import React from 'react';
import ReactDOM from 'react-dom';

export class CreateTextAtom extends React.Component {
  
  handleTextInput(e) {
    this.props.update({text: e.currentTarget.value});
  }
  
  componentDidUpdate () {
    // Adjusts the textarea's height automatically
    const textarea = ReactDOM.findDOMNode(this);
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
  
  render() {
    const textareaStyle = {
      width: '100%', 
      height: 'auto', 
      resize: 'none',
      outline: 'none',
      overflow: 'hidden',
      border: 'none',
    };
    
    return (
      <textarea 
        type='text'  
        value={this.props.content.text} 
        onChange={this.handleTextInput.bind(this)} 
        autoComplete='false'
        placeholder='Write your content here'
        style={textareaStyle} 
      />
    );
  }
}

CreateTextAtom.defaultContent = {
  text: ''
};

CreateTextAtom.buttonCaption = '+ Text';

export class TextAtom extends React.Component {
  
  render() {
    
    return <div>{ this.props.content.text }</div>;
  }
}
