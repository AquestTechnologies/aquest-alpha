import React from 'react';

export default class Card extends React.Component {
  
  handleClick(universeId, id) { 
    console.log(`-C- Card.handleClick ${id}`);
    this.props.transitionTo(`/_${universeId}/${id}`);
  }
  
  renderPreview(previewType, previewContent) {
    return previewType === 'image' ?
      <img src={previewContent.path} className='card_image' /> :
      <div className='card_description'>{previewContent.text}</div>;
  }
  
  renderFooter(previewType) {
    if (previewType === 'image') return <div className='card_footer'></div>;
  }
    
  render() {
    const { title, userId, createdAt, previewType, previewContent, universeId, id } = this.props.topic;
    
    return (
      <div className='card' onClick={this.handleClick.bind(this, universeId, id)}>
      
        <div className='card_title'>
          { title }
        </div>
        
        <div className='card_author'>
          { `By ${userId}, ${createdAt} ago.` }
        </div>
        
        { this.renderPreview(previewType, previewContent) }
        { this.renderFooter(previewType) }
        
      </div>
    );
  }
}
