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
    const { topic, topicId, readTopicAtoms, readTopic } = this.props;
    if (!topic) readTopic(topicId);
    else if (!topic.atoms) readTopicAtoms(topic.id);
  }
  
  render() {
    const { topic } = this.props;
    const { title, userId, createdAt } = topic ? topic : {};
    const atoms = topic ? topic.atoms ? topic.atoms : ['Loading...'] : undefined;
    
    return !topic ? <div>Loading...</div> : (
      <div>
        <div className="topic">
          <div className="topic_title">
            {title}
          </div>
          <div className="topic_author">
            {`By ${userId}, ${createdAt} ago.`}
          </div>
          <div className="topic_content">
            {atoms.map((atom, index) => <div key={index}>{JSON.stringify(atom)}</div>)}
          </div>
        </div>
          
      </div>
    );
  }
}
