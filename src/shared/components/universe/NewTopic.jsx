import React from 'react';

import Chat from './Chat.jsx';

class NewTopic extends React.Component {
  
  render() {
    return (
      <div>
        <div className="universe_left">
          <div className="universe_left_scrollable">
            <div className="universe_left_scrolled">
              <div className="">
                yo
              </div>
            </div>
          </div>
        </div>
        <Chat chatId={this.props.universe.chatId} chat={this.props.chat} actions={this.props.actions} />
      </div>
    );
  }
}

NewTopic.defaultProps = {
};

export default NewTopic;