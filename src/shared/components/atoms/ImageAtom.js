import React from 'react';

export class CreateImageAtom extends React.Component {
  
  handleURLInput(e) {
    const { content, update } = this.props;
    content.url = e.currentTarget.value;
    update(content);
  }
  
  render() {
    
    return (
      <div>
        <div>From URL</div>
        <input 
          type='text' 
          value={this.props.content.url}
          onChange={this.handleURLInput.bind(this)} 
          autoComplete='false'
          placeholder='http://website.com/image.xyz'
        />
        <div>- or -</div>
        <div>From your computer</div>
        <button>Done</button>
      </div>
    );
  }
}

CreateImageAtom.defaultContent = {
  url: '',
  width: '0',
  height: '0'
};

CreateImageAtom.buttonCaption = '+ Image';
