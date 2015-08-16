import React from 'react';

export default class Card extends React.Component {
  
  handleClick(universeId, id) { 
    console.log(`-C- Card.handleClick ${id}`);
    this.props.transitionTo(`/~${universeId}/${id}`);
  }
  
  renderPreview(previewType, previewContent) {
    return previewType === 'image' ?
      <img src={previewContent.get('path')} className='card_image' /> :
      <div className='card_description'>{ previewContent.get('text') }</div>;
  }
  
  renderFooter(previewType) {
    if (previewType === 'image') return <div className='card_footer'></div>;
  }
    
  render() {
    const { topic } = this.props;
    const id = topic.get('id');
    const title = topic.get('title');
    const userId = topic.get('userId');
    const createdAt = topic.get('createdAt');
    const universeId = topic.get('universeId');
    const previewType = topic.get('previewType');
    const previewContent = topic.get('previewContent');
    
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
