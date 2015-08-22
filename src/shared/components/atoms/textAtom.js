import React from 'react';

class TextAtomViewer extends React.Component {
  
  render() {
    
    return (
      <div style={{whiteSpace: 'pre'}}>
        { this.props.content.text }
      </div>
    );
  }
}

class TextAtomCreator extends React.Component {
  
  handleTextInput(e) {
    const textarea = e.currentTarget;
    const text = textarea.value;
    this.props.update({
      content: { text },
      ready: text ? 'yes' : 'no',
    });
  }
  
  componentDidUpdate() {
    
    // Adjusts the textarea's height automatically
    const textarea = React.findDOMNode(this.refs.textarea);
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight;
  }
  
  render() {
    const { content: {text}, validationErrors } = this.props;
    const textareaStyle = {
      width: '100%', 
      height: 'auto', 
      resize: 'none',
      outline: 'none',
      overflow: 'hidden',
      border: 'none',
    };
    const errorsDivStyle = {
      display: validationErrors ? 'block' : 'none',
    };
    
    return (
      <div>
        <div style={errorsDivStyle}>
          { JSON.stringify(validationErrors) }
        </div>
        <textarea 
          type='text' 
          value={text} 
          ref='textarea'
          onChange={this.handleTextInput.bind(this)} 
          autoComplete='false'
          placeholder='Write your story here'
          style={textareaStyle} 
        />
      </div>
    );
  }
}

TextAtomCreator.buttonCaption = 'Text';
TextAtomCreator.initialState = {};
TextAtomCreator.initialContent = {
  text: ''
};

function createPreview({ text }) {
  const N = 150;
  
  return new Promise.resolve({
    text: text.length > N ? text.substr(0, N) + '...' : text
  });
}

const validationConstraints = {
  text: {
    presence: {
      message: '^Content should not be empty'
    },
  },
};

export default {
  name: 'text',
  createPreview,
  validationConstraints,
  Viewer: TextAtomViewer,
  Creator: TextAtomCreator,
  Previewer: TextAtomViewer,
};
