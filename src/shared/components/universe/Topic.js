import React from 'react';

export default class Topic extends React.Component {
  
  // Load les données initiales
  static runPhidippides(routerState) {
    return [{
      id:         'topic',
      creator:    'readTopic',
      args:       [routerState.params.topicId]
    }];
  }
  
  componentWillMount() {
    const { topic, topicId, readTopicContent, readTopic } = this.props;
    if (!topic) readTopic(topicId);
    else if (!topic.content) readTopicContent(topic.id);
  }
  
  render() {
    const { topic } = this.props;
    const { title, userId, created_at } = topic ? topic : {};
    const content = topic ? topic.content ? typeof(topic.content) === 'object' ? topic.content : JSON.parse(topic.content) : ['Loading...'] : undefined;
    
    return !topic ? <div>Loading...</div> : (
      <div>
        <div className="topic">
          <div className="topic_title">
            {title}
          </div>
          <div className="topic_author">
            {`By ${userId}, ${created_at} ago.`}
          </div>
          <div className="topic_content">
            {content.map((atom, index) => <div key={index}>{JSON.stringify(atom.text)}</div>)}
          </div>
        </div>
          
      </div>
    );
  }
}
