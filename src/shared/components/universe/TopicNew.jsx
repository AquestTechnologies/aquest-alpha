import React from 'react';

class TopicNew extends React.Component {
  
  render() {
    return (
      <div className="universe_left" style={{backgroundImage: 'url(' + this.props.universe.picturePath + ')'}}>
        <div className="universe_left_scrollable">
          <div className="universe_left_scrolled">
            <div className="topicNew_header">
              New topic in {this.props.universe.name}
            </div>
            <div className="topicNew_rules">
              yo, please don't be evil
            </div>
            <div className="topicNew">
             sup?
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TopicNew;