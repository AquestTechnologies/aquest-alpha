import React from 'react';

export default class Card extends React.Component {
  
  handleClick(topic) { 
    console.log(`-C- Card.handleClick ${topic.id}`);
    this.props.transitionTo(`/_${topic.universeId}/${topic.id}`);
  }
  
  renderPreview(hasPicture) {
    if (hasPicture) return <img src={this.props.topic.picture} className='card_image' />;
    return <div className='card_description'>{this.props.topic.description}</div>;
  }
  
  renderFooter(hasPicture) {
    if (!hasPicture) return <div className='card_footer'></div>;
  }
    
  render() {
    const {topic}    = this.props;
    const hasPicture = topic.picture.length;
    
    return (
      <div className='card' onClick={this.handleClick.bind(this, topic)}>
      
        <div className='card_title'>
          {topic.title}
        </div>
        
        <div className='card_author'>
          {`By ${topic.author}, ${topic.timestamp} ago.`}
        </div>
        
        {this.renderPreview(hasPicture)}
        {this.renderFooter(hasPicture)}
        
      </div>
    );
  }
}
