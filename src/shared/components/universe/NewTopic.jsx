import React from 'react';

import Chat from './Chat.jsx';

class NewTopic extends React.Component {
  
  render() {
    return (
      <div className="universe_left" style={{backgroundImage: 'url(' + this.props.universe.picturePath + ')'}}>
        <div className="universe_left_scrollable">
          <div className="universe_left_scrolled">
            <div className="">
              yo
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NewTopic.defaultProps = {
};

export default NewTopic;