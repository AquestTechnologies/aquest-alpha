import React from 'react';
import log from '../../utils/logTailor';
import uploadFile from '../../../client/lib/uploadFile';

// A regex to test image URL 
// Also matches any string starting with "blob"
const pattern = '^blob.*|^https?:\/\/(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png)$';

// Loading the image with JS is a strong choice
// But it allows for a better UI
class ImageAtomViewer extends React.Component {
  
  constructor() {
    super();
    this.state = {
      url: null,
      errorMessage: '',
    };
  }
  
  componentWillMount() {
    const { url } = this.props.content;
    const image = new Image();
    
    image.onload = () => this.setState({ url });
    image.onerror = () => this.setState({ errorMessage: ':( Image not found'});
    image.src = this.props.content.url;
  }
  
  render() {
    const divStyle = {
      textAlign: 'center',
    };
    const imageStyle = {
      width: 'auto',
      height: 'auto',
      maxWidth: '100%',
      maxHeight: '100%',
    };
    
    const { url, errorMessage } = this.state;
    
    return <div style={divStyle}>
      { 
        errorMessage ? errorMessage : url ? <img src={url} style={imageStyle} /> : 'Loading image...' 
      }
    </div>;
  }
}

class ImageAtomCreator extends React.Component {
  
  constructor() {
    super();
    this.imageURLRegex = new RegExp(pattern);
  }
  
  componentWillReceiveProps(nextProps) {
    const { atomsShouldGetReady, ready } = this.props;
    
    if (atomsShouldGetReady && ready === 'no') {
      const { update, uploadFile, content: { url }, state: { contentType } } = this.props;
      
      if (contentType === 'url') {
        
          // update({
          //   ready: 'error',
          //   state: { errorMessage: err.message }, // A bit brutal for the user...
          // });
        
      } else {
        
      }
    }
  }
  
  handleURLDoneClick(e) {
    
    const { state: { urlInput }, update } = this.props;
    
    if (this.imageURLRegex.test(urlInput)) update({
      content: {
        url: urlInput
      },
      state: {
        contentType: 'url',
        urlMessage: '',
      }
    });
    else update({
      state: { 
        contentType: '',
        urlMessage: 'Please enter a valid image URL',
      }
    });
  }
  
  handleEditClick(e) {
    this.props.update({
      content: {
        url: '',
      },
      state: { 
        contentType: '',
      }
    });
  }
  
  handleURLInput(e) {
    this.props.update({
      state: { 
        urlMessage: '',
        urlInput: e.currentTarget.value,
      }
    });
  }
  
  handleSelectFileClick(e) {
    // The real file selector is hidden for design purpose
    document.getElementById('inputFile').click();
  }
  
  handleFileChange(e) {
    this.props.update({
      content: {
        url: window.URL.createObjectURL(document.getElementById('inputFile').files[0]),
      },
      state: { 
        contentType: 'blob', 
      }
    });
  }
  
  render() {
    const {
      content: { url }, 
      state: { urlInput, urlMessage, fileMessage, contentType },
      validationErrors,
    } = this.props;
    
    const doneStyle = {
      visibility: urlInput ? 'visible' : 'hidden'
    };
    const validationDivStyle = { 
      display: validationErrors ? 'block' : 'none' 
    };
    
    return contentType ? 
      <div>
        <button onClick={this.handleEditClick.bind(this)}>Edit</button>
        <ImageAtomViewer content={{url}} />
      </div>
      :
      <div>
        <div style={validationDivStyle}>
          { JSON.stringify(validationErrors) }
        </div>
        <div>From URL</div>
        <div>
          <div>{ urlMessage }</div>
          <input 
            size='50'
            type='text' 
            value={urlInput}
            autoComplete='false'
            onChange={this.handleURLInput.bind(this)} 
            placeholder='http://website.com/image.xyz'
          />
          <button onClick={this.handleURLDoneClick.bind(this)} style={doneStyle}>Done</button>
        </div>
        
        <br />
        <div>{'- or -'}</div>
        <br />
        
        <div>{ fileMessage }</div>
        <div onClick={this.handleSelectFileClick.bind(this)}>
          <div>From your computer</div>
          <div>Valid formats: png, jpg, jpeg, gif</div>
          <input 
            type='file'
            id='inputFile'
            accept='image/*'
            onChange={this.handleFileChange.bind(this)}
            style={{display: 'none'}}
          />
        </div>
      </div>;
  }
}

ImageAtomCreator.buttonCaption = 'Image';
ImageAtomCreator.initialState = {
  urlInput: '',
  urlMessage: '',
  fileMessage: '',
  contentType: '',
};
ImageAtomCreator.initialContent = {
  url: '',
};

function createPreview(content) {
  return new Promise((resolve, reject) => {
    resolve();
  });
}

const validationConstraints = {
  url: {
    presence: {
      message: '^Please provide an URL of a file',
    },
    format: {
      pattern,
      message : "^Invalid image URL",
    },
  },
};


export default {
  name: 'image',
  createPreview,
  validationConstraints,
  Viewer: ImageAtomViewer,
  Creator: ImageAtomCreator,
  Previewer: ImageAtomViewer,
};
