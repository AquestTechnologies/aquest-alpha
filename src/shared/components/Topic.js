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
    const {topic, readTopicContent} = this.props;
    if (!topic.content) readTopicContent(topic.id);
  }
  
  render() {
    const {topic} = this.props;
    const {title, author, timestamp} = topic;
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
