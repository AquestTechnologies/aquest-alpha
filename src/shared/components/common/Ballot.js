import React from 'react';

export default class Ballot extends React.Component {
  
  constructor() {
    super();
    
    this.handleVote = e => {
      const { id, content, voteTargetContext, sessionUserId, universeId, createVote } = this.props;
      
      createVote({id, voteTargetContext, sessionUserId, universeId});
    };
  }
  
  render() {
    const { voteTargetContext, content, value, position, description } = this.props;
    const vote = this.props.vote.length ? JSON.parse(this.props.vote) : [];
    
    return (
      <span className="ballot">
        <input type='button' value={`${content} ${vote.length}`} onClick={this.handleVote}></input>
        {vote.length > 3 ? 
          <span className="voteAuthorsCollapsed">'...'</span> : 
          <span className="voteAuthors"> {vote.map( ({userId}) => userId )} </span>}
      </span>
    );
  }
}
