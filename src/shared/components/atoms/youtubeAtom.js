import React from 'react';
import log from '../../utils/logTailor';
import { youtubeAPIKey } from '../../../../config/dev_google';

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
  
  handleIdInput(e) {
    
    const inputValue = e.currentTarget.value;
    const match = inputValue.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/);
    const id = match && match[1].length === 11 ? match[1] : '';
    
    this.props.update({
      state: { inputValue },
      content: { id },
    });
  }
  
  handleEditClick(e) {
    
    this.props.update({
      state: { inputValue: '' },
      content: { id: '' },
      ready: 'no',
    });
  }
  
  componentWillReceiveProps(nextProps) {
    
    const { atomsShouldGetReady, ready, update, content: { id } } = nextProps;
    
    // Checks if given video id leads to a valid youtube video
    if (atomsShouldGetReady && ready === 'no') {
      
      update({ ready: 'pending' });
      log('Youtube atom getting ready');
      
      const xhr = new XMLHttpRequest();
      xhr.onerror = err => {
        log(err);
        update({
          ready: 'error',
          state: { errorMessage: err.message }, // A bit brutal for the user...
        });
      };
      
      // https://developers.google.com/youtube/v3/docs/videos/list
      xhr.open('get', `https://www.googleapis.com/youtube/v3/videos?key=${youtubeAPIKey}&part=id&id=${id}`);
      xhr.onload = () => {
        const { status, response } = xhr;
        log(status, response);
        
        if (status !== 200) return update({
          ready: 'error',
          state: { errorMessage: 'Youtube service unavailable' },
        });
        
        // response.pageInfo.totalResults should be === 1
        if (!JSON.parse(response).pageInfo.totalResults) update({
          ready: 'error',
          state: { errorMessage: 'This video is either private or deleted' }, // Not sure if that is true
        });
        else update({
          ready: 'yes',
        });
      };
      
      xhr.send();
    }
  }
  
  render() {
    const { content, state: { inputValue, errorMessage }, validationErrors } = this.props;
    
    const validationDivStyle = { display: validationErrors ? 'block' : 'none' };
    const errorDivStyle = { display: errorMessage ? 'block' : 'none' };
    
    return (
      <div>
        <div style={validationDivStyle}>
          { JSON.stringify(validationErrors) }
        </div>
        <div style={errorDivStyle}>
          { errorMessage }
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
YoutubeAtomCreator.initialState = {
  inputValue: '',
  errorMessage: '',
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
