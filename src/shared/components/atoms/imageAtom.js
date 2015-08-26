import React from 'react';

// A regex to test URL 
const pattern = "^https?://(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpe?g|gif|png)$";

class ImageAtomViewer extends React.Component {
  
  render() {
    const { url, width, height } = this.props.content;
    
    return <div>
      <img src={url} width={width} height={height} />
    </div>;
  }
}

class ImageAtomCreator extends React.Component {
  
  constructor() {
    super();
    this.imageURLRegex = new RegExp(pattern);
  }
  
  handleURLDoneClick(e) {
    
    const { state: { urlInput }, update } = this.props;
    
    if (this.imageURLRegex.test(urlInput)) update({
      content: {
        url: urlInput
      },
      state: {
        hasContent: true,
        urlMessage: '',
      }
    });
    else update({
      state: { 
        hasContent: false,
        urlMessage: 'Please enter a valid image URL',
      }
    });
  }
  
  handleEditClick(e) {
    this.props.update({
      state: { 
        fileInput: null,
        hasContent: false,
      }
    });
  }
  
  handleURLInput(e) {
    this.props.update({
      state: { 
        urlInput: e.currentTarget.value 
      }
    });
  }
  
  handleSelectFileClick(e) {
    // The real file selector is hidden for design purpose
    document.getElementById('inputFile').click();
  }
  
  handleFileChange(e) {
    this.props.update({
      state: { 
        hasContent: true, 
        fileInput: document.getElementById('inputFile').files[0],
      }
    });
  }
  
  render() {
    const {
      content: { url, width, height }, 
      state: { urlInput, urlMessage, fileInput, fileMessage, hasContent }
    } = this.props;
    
    const doneStyle = {
      visibility: urlInput ? 'visible' : 'hidden'
    };
    
    return hasContent ? 
      <div>
        <button onClick={this.handleEditClick.bind(this)}>Edit</button>
        <ImageAtomViewer content={{
          width,
          height,
          url: fileInput ? window.URL.createObjectURL(fileInput) : url,
        }} />
      </div>
      :
      <div>
        <br />
        
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
  fileInput: null,
  fileMessage: '',
  hasContent: false,
};
ImageAtomCreator.initialContent = {
  url: '',
  width: 0,
  height: 0,
};

function createPreview(content) {
  return new Promise((resolve, reject) => {
    resolve();
  });
}

const validationConstraints = {
  url: {
    presence: true,
    format: {
      pattern,
      message: "Invalid image URL."
    }
  },
  width: {
    presence: true,
  },
  height: {
    presence: true,
  }
};

export default {
  name: 'image',
  createPreview,
  validationConstraints,
  Viewer: ImageAtomViewer,
  Creator: ImageAtomCreator,
  Previewer: ImageAtomViewer,
};
