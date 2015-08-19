import React from 'react';

class YoutubeAtomCreator extends React.Component {
  
  constructor() {
    super();
    this.state = { input: '' };
  }
  
  handleIdInput(e) {
    const { value } = e.currentTarget;
    const { width, height } = this.props.content;
    const match = value.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/);
    
    if (match && match[1].length === 11) {
      this.props.update({
        width,
        height,
        id: match[1]
      });
      this.setState({
        input: value,
      });
    } else {
      this.setState({
        input: value,
      });
    }
  }
  
  handleEditClick(e) {
    this.props.update({id: '' });
  }
  
  render() {
    const { input } = this.state;
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
            <button onClick={this.handleEditClick.bind(this)}>Edit</button>
            <YoutubeAtomViewer content={content} />
          </div>
          :
          <input 
            type='text'
            size='100'
            value={input} 
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



class YoutubeAtomViewer extends React.Component {
  
  render() {
    const { id, width, height } = this.props.content;
    
    return (
      <div>
        <iframe 
          width={width} 
          height={height} 
          src={`https://www.youtube.com/embed/${id}?rel=0&amp;showinfo=0`} 
          frameBorder="0" 
          allowFullScreen
        ></iframe>
      </div>
    );
  }
}

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
