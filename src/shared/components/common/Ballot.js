import React from 'react';

export default class Ballot extends React.Component {
  
  constructor() {
    super();
    
    this.handleVote = e => {
      const { id, users, voteTargetContext, sessionUserId, universeId, createVote, deleteVote } = this.props;
      
      const voteIndex = users && users.length ? users.findIndex( (user) => user === sessionUserId ) : -1;
      
      if (voteIndex === -1) createVote({id, voteTargetContext, sessionUserId, universeId});
      else deleteVote({id, voteTargetContext, sessionUserId, universeId});
    };
  }
  
  render() {
    const { users } = this.props;
    
    return (
      <span className="vote">
        <input type='button' value={`${this.props.id} ${users.length}`} onClick={this.handleVote}></input>
        {users.length > 3 ? 
          <span className="voteAuthorsCollapsed">'...'</span> : 
          <span className="voteAuthors"> {users.map( (user) => user.userId )} </span>}
      </span>
    );
  }
}
