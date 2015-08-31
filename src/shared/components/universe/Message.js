import React from 'react';
import Vote from '../common/Vote';
import Icon from '../common/Icon';

export default class Message extends React.Component {
  
  render() {
    
    const { id, userId, type, content: {text}, createdAt, universeId, chatId, sessionUserId, chatContextId, emitCreateVoteMessage, emitDeleteVoteMessage, messageIndex } = this.props;
    const vote = this.props.vote || { 'Thanks': [], 'Agree': [], 'Disagree': [], 'Irrelevant': [], 'Shocking': [] };
      
    if (!vote[universeId]) vote[universeId] = []; 
    
    const voteTargetContext = {chatId, chatContextId, messageId: id, messageIndex};
    
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
              <Vote 
                id={key}
                key={key}
                users={vote[key]}
                universeId={universeId}
                sessionUserId={sessionUserId}
                chatContextId={chatContextId}
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
