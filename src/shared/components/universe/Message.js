import React from 'react';
import Ballot from '../common/Ballot';
import Icon from '../common/Icon';

export default class Message extends React.Component {
  
  render() {
    
    const { id, userId, type, content: {text}, createdAt, universeId, chatId, sessionUserId, voteContextId, emitCreateVoteMessage, emitDeleteVoteMessage, messageIndex, vote, ballot } = this.props;
    
    const voteTargetContext = {chatId, voteContextId, messageId: id, messageIndex};
      
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
            { ballot.map( ({id, content, value, position, description}) =>
              <Ballot 
                id={id}
                key={id}
                content={content}
                value={value}
                position={position}
                description={description}
                vote={vote[content] || []}
                universeId={universeId} // not really necessary, depends on the database query optimization
                sessionUserId={sessionUserId}
                createVote={emitCreateVoteMessage}
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
