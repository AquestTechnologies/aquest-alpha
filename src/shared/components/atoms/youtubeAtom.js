import React from 'react';

class YoutubeAtomViewer extends React.Component {
  
  render() {
    const { id, width, height } = this.props.content;
    
    return <iframe 
      width={width} 
      height={height} 
      src={`https://www.youtube.com/embed/${id}?rel=0&amp;showinfo=0`} 
      frameBorder='0' 
      allowFullScreen
    />;
  }
}

class YoutubeAtomCreator extends React.Component {
  
  constructor() {
    super();
    this.state = { inputValue: '' };
  }
  
  handleIdInput(e) {
    const { value } = e.currentTarget;
    const { update, content: { width, height } } = this.props;
    const match = value.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/);
    
    this.setState({
      inputValue: value,
    });
    
    if (match && match[1].length === 11) update({
      width,
      height,
      id: match[1]
    });
  }
  
  handleEditClick(e) {
    const { width, height } = this.props.content;
    this.props.update({
      width,
      height,
      id: '' 
    });
  }
  
  render() {
    const { inputValue } = this.state;
    const { content, validationErrors } = this.props;
    const errorsDivStyle = {
      display: validationErrors ? 'block' : 'none',
    };
    
    return (
      <div>
        <div style={errorsDivStyle}>
          { JSON.stringify(validationErrors) }
        </div>
        {
          content.id ?
          <div>
            <div>
              <button onClick={this.handleEditClick.bind(this)}>Edit</button>
            </div>
            <YoutubeAtomViewer content={content} />
          </div>
          :
          <input 
            type='text'
            size='100'
            value={inputValue} 
            onChange={this.handleIdInput.bind(this)} 
            autoComplete='false'
            placeholder='https://www.youtube.com/watch?v=qXvZpn_dnMs'
          />
        }
      </div>
    );
  }
}

YoutubeAtomCreator.buttonCaption = 'YouTube';
YoutubeAtomCreator.initialContent = {
  id: '',
  width: 420, // Youtube default
  height: 315,
};

const createPreview = content => new Promise.resolve(content);

const validationConstraints = {
  id: {
    presence: {
      message: '^Invalid video URL'
    },
    length: {
      is: 11
    } 
  },
  width: {
    presence: true,
    numericality: {
      onlyInteger: true,
      greaterThan: 100,
      lessThanOrEqualTo: 1000,
    }
  },
  height: {
    presence: true,
    numericality: {
      onlyInteger: true,
      greaterThan: 100,
      lessThanOrEqualTo: 1000,
    }
  }
};

export default {
  name: 'youtube',
  createPreview,
  validationConstraints,
  Viewer: YoutubeAtomViewer,
  Creator: YoutubeAtomCreator,
  Previewer: YoutubeAtomViewer,
};
