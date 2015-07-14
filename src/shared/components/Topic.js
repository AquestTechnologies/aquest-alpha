import React from 'react';

class Topic extends React.Component {
  
  // Load les données initiales
  static runPhidippides(routerState) {
    return [{
      id:         'topic',
      creator:    'loadTopic',
      args:       [routerState.params.topicId]
    }];
  }
  
  componentWillMount() {
    // console.log('.C. Topic.componentWillMount');
    const topic = this.props.topics[this.props.params.topicId];
    if (!topic.content) this.props.loadTopicContent(topic.id);
  }
  
  // componentWillReceiveProps(nextProps) {
  //   this.setState({ topic: nextProps.topic });
  // }
  
  render() {
    const topic = this.props.topics[this.props.params.topicId];
    
    return (
      <div>
        <div className="topic">
          <div className="topic_title">
            {topic.title}
          </div>
          <div className="topic_author">
            {`By ${topic.author}, ${topic.timestamp} ago.`}
          </div>
          <div className="topic_content">
            {topic.content || 'no content yet'}
          </div>
        </div>
          
      </div>
    );
  }
}

// Topic.defaultProps = {
//   universe: {},
//   topic: {
//   title: 'A default title is better than no title!' ,
//   author: 'Someone',
//   timestamp: '0',
//   content: 'Hello world',
//   handle: '000-A default'
//   }
// };

// Permet d'acceder a this.context.router
Topic.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default Topic;