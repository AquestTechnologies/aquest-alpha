import React from 'react';

class NewTopic extends React.Component {
  
  render() {
    return (
      <div>
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
    );
  }
}

export default NewTopic;