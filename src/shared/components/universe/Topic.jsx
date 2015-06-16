import React from 'react';

import Chat from './Chat.jsx';

class Topic extends React.Component {
  
  render() {
    return (
      <div className="universe_left">
        <div className="universe_left_scrollable">
          <div className="universe_left_scrolled">
            <div className="topic">
              yo
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Topic.defaultProps = {
  universe: {},
  topic: {}
};

export default Topic;