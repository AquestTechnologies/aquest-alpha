import React from 'react';

export default class Ballot extends React.Component {
  
  constructor() {
    super();
    
    this.handleVote = e => {
      const { ballotId, voteTargetContext, sessionUserId, createVote } = this.props;
      
      createVote({ballotId, voteTargetContext, sessionUserId});
    };
  }
  
  render() {
    //NOTE : ballot are already in ascending order
    const { content, position, description, vote} = this.props;
    console.log(vote);
    
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
