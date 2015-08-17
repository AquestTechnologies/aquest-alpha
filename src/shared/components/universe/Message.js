import React from 'react';
import Icon from '../common/Icon';

export default class Message extends React.Component {
  
  render() {
    
    const { userId, type, content: {text} } = this.props;
    
    return (
      <div className="message">
        <Icon name="disk" cssclass="message_icon" />
        <div className="message_body">
          <div className="message_author">
            {userId}
          </div>
          <div className="message_content">
            {text}
          </div>
        </div>
      </div>
    );
  }
}
