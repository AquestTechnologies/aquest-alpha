import React from 'react';

import Chat from './Chat.jsx';

class Topic extends React.Component {
  
  render() {
    return (
      <div>
        <div className="universe_left">
          <div className="universe_left_scrollable">
            <div className="universe_left_scrolled">
              <div className="topic">
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

Topic.defaultProps = {
  universe: {},
  topic: {}
};

export default Topic;