import React from 'react';
import Ballot from '../common/Ballot';
import Icon from '../common/Icon';

export default class Message extends React.Component {
  
  render() {
    
    const { id, userId, type, content: {text}, createdAt, universeId, chatId, sessionUserId, vote, voteContextId, emitCreateVoteMessage, emitDeleteVoteMessage, messageIndex } = this.props;
    
    const voteTargetContext = {chatId, voteContextId, messageId: id, messageIndex};
    console.log(vote);
    return (
      <div className="message">
        <Icon name="disk" cssclass="message_icon" />
        <div className="message_body">
          <div className="message_author">
            {userId} {id}
          </div>
          <div className="message_content">
            {text}
          </div>
          <div className="vote">
            { Object.keys(vote).map( (key) =>
              <Ballot 
                id={key}
                key={key}
                users={vote[key].users || []}
                universeId={universeId} // not really necessary, depends on the database query optimization
                sessionUserId={sessionUserId}
                createVote={emitCreateVoteMessage}
                deleteVote={emitDeleteVoteMessage}
                voteTargetContext={voteTargetContext}
              />)
            }
          </div>
          {createdAt ? 
            <span>{createdAt}</span> : 
            <span>loading</span>}
        </div>
      </div>
    );
  }
}
