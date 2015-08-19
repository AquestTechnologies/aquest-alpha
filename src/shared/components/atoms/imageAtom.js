import React from 'react';

class ImageAtomViewer extends React.Component {
  
  render() {
    const { url, width, height } = this.props.content;
    return <img src={url} width={width} height={height} />;
  }
}

class ImageAtomCreator extends React.Component {
  
  constructor() {
    super();
    this.state = { ready: false };
  }
  
  handleDoneClick(e) {
    this.setState({ ready: true });
  }
  
  handleEditClick(e) {
    this.setState({ ready: false });
  }
  
  handleURLInput(e) {
    const { content, update } = this.props;
    content.url = e.currentTarget.value;
    update(content);
  }
  
  handleSelectFileClick(e) {
    document.getElementById('inputFile').click();
  }
  
  handleFileChange(e) {
    const { content, update } = this.props;
    content.localFile = document.getElementById('inputFile').files[0];
    update(content);
    this.setState({ ready: true });
  }
  
  render() {
    const { url, localFile, width, height } = this.props.content;
    const contentForViewer = {
      width,
      height,
      url: localFile ? window.URL.createObjectURL(localFile) : url,
    };
    const doneStyle = {
      visibility: url ? 'visible' : 'hidden'
    };
    const done2Style = {
      visibility: localFile ? 'visible' : 'hidden'
    };
    
    return this.state.ready ? 
      <div>
        <div>
          <button onClick={this.handleEditClick.bind(this)}>Edit</button>
        </div>
        <ImageAtomViewer content={contentForViewer} />
      </div>
      :
      <div>
        <div>From URL</div>
        <input 
          size='50'
          type='text' 
          value={url}
          onChange={this.handleURLInput.bind(this)} 
          autoComplete='false'
          placeholder='http://website.com/image.xyz'
        />
        <button onClick={this.handleDoneClick.bind(this)} style={doneStyle}>Done</button>
        <div>- or -</div>
        <div>
          <span onClick={this.handleSelectFileClick.bind(this)}>From your computer</span>
          <span>{ localFile ? `(${localFile.name})` : '' }</span>
          <button onClick={this.handleDoneClick.bind(this)} style={done2Style}>Done</button>
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
ImageAtomCreator.initialContent = {
  url: '',
  localFile: undefined,
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
