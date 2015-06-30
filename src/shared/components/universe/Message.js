import React from 'react';
import Icon from '../common/Icon';

class Message extends React.Component {
  render() {
    return (
      <div className="message">
        <Icon name="disk" cssclass="message_icon" />
        <div className="message_body">
          <div className="message_author">
            {this.props.author}
          </div>
          <div className="message_content">
            {this.props.content}
          </div>
        </div>
      </div>
    );
  }
}

Message.defaultProps = {
  author: "Cicero",
  content: "Lorem ipsum dolor sit amet.",
};

export default Message;