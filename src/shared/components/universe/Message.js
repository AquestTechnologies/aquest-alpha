import React from 'react';
import Ballot from '../common/Ballot';
import Icon from '../common/Icon';

export default class Message extends React.Component {
  
  render() {
    
    const { id, userId, type, content: {text}, createdAt, chatId, sessionUserId, voteContextId, emitCreateVoteMessage, messageIndex, vote, ballot } = this.props;
    
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
                key={id}
                value={value}
                ballotId={id}
                content={content}
                position={position}
                description={description}
                sessionUserId={sessionUserId}
                createVote={emitCreateVoteMessage}
                vote={(vote || {})[id] || []}
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
