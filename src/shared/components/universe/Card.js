import React from 'react';
import Vote from '../common/Vote';

export default class Card extends React.Component {
  
  handleClick(universeId, id) { 
    console.log(`-C- Card.handleClick ${id}`);
    this.props.transitionTo(`/~${universeId}/${id}`);
  }
  
  renderPreview(previewType, previewContent) {
    return previewType === 'image' ?
      <img src={previewContent.path} className='card_image' /> :
      <div className='card_description'>{ previewContent.text }</div>;
  }
  
  renderFooter(previewType) {
    if (previewType === 'image') return <div className='card_footer'></div>;
  }
    
  render() {
    const { 
      topic: {id, title, userId, createdAt, universeId, previewType, previewContent}, 
      emitCreateVoteTopic, emitDeleteVoteTopic, voteContextId, sessionUserId 
    } = this.props;
    
    const vote = this.props.topic.vote || { 'Thanks': [], 'Agree': [], 'Disagree': [], 'Irrelevant': [], 'Shocking': [] };
    if (!vote[universeId]) vote[universeId] = []; 
    
    const voteTargetContext = {voteContextId, topicId: id};
    
    return (
      <div className='card' onClick={this.handleClick.bind(this, universeId, id)}>
        <div className='card_title'>
          { title }
        </div>
        
        <div className='card_author'>
          { `By ${userId}, ${createdAt} ago.` }
          { Object.keys(vote).reduce( (prev, key) => {prev + (vote[key].value * vote[key].users.length)}, 0) }
        </div>
        
        { this.renderPreview(previewType, previewContent) }
        { this.renderFooter(previewType) }
        
      </div>
    );
  }
}
