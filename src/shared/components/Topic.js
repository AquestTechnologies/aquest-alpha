import React from 'react';

class Topic extends React.Component {
  
  // Load les données initiales
  static runPhidippides(routerState) {
    return [{
      id:         'topic',
      creator:    'readTopic',
      args:       [routerState.params.topicId]
    }];
  }
  
  componentWillMount() {
    const {id, content} = this.props.topics[this.props.params.topicId];
    if (!content) this.props.readTopicContent(id);
  }
  
  render() {
    const topic = this.props.topics[this.props.params.topicId];
    const {title, author, timestamp} = topic;
    console.log(typeof(topic.content));
    const content = topic.content ? typeof(topic.content) === 'object' ? topic.content : JSON.parse(topic.content) : ['Loading...'];
    
    return (
      <div>
        <div className="topic">
          <div className="topic_title">
            {title}
          </div>
          <div className="topic_author">
            {`By ${author}, ${timestamp} ago.`}
          </div>
          <div className="topic_content">
            {content.map((atom, index) => <div key={index}>{JSON.stringify(atom.text)}</div>)}
          </div>
        </div>
          
      </div>
    );
  }
}

// Permet d'acceder a this.context.router
Topic.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default Topic;