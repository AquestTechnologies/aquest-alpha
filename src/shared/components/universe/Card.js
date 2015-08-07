import React from 'react';

export default class Card extends React.Component {
  
  handleClick(universeId, id) { 
    console.log(`-C- Card.handleClick ${id}`);
    this.props.transitionTo(`/_${universeId}/${id}`);
  }
  
  renderPreview(picture, description) {
    return picture ?
      <img src={picture} className='card_image' /> :
      <div className='card_description'>{this.props.topic.description}</div>;
  }
  
  renderFooter(picture) {
    if (picture.length) return <div className='card_footer'></div>;
  }
    
  render() {
    const { title, userId, createdAt, picture, description, universeId, id } = this.props.topic;
    
    return (
      <div className='card' onClick={this.handleClick.bind(this, universeId, id)}>
      
        <div className='card_title'>
          { title }
        </div>
        
        <div className='card_author'>
          { `By ${userId}, ${createdAt} ago.` }
        </div>
        
        { this.renderPreview(picture, description) }
        { this.renderFooter(picture) }
        
      </div>
    );
  }
}
