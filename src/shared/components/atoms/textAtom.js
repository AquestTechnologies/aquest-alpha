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
    this.props.update({text: textarea.value});
    // Adjusts the textarea's height automatically
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
          onChange={this.handleTextInput.bind(this)} 
          autoComplete='false'
          placeholder='Write your content here'
          style={textareaStyle} 
        />
      </div>
    );
  }
}

TextAtomCreator.buttonCaption = 'Text';
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
