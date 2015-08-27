import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { readTopic, readTopicAtoms } from '../actionCreators';

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
    const { topic, topicId, readTopic, readTopicAtoms } = this.props;
    if (!topic) readTopic(topicId);
    else if (!topic.atoms) readTopicAtoms(topicId);
  }
  
  render() {
    const { topic } = this.props || {};
    const { title, userId, createdAt } = topic || {};
    const atoms = topic && topic.atoms ? topic.atoms : ['Loading...'];
    
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

const mapActions = dispatch => bindActionCreators({ readTopic, readTopicAtoms }, dispatch);

export default connect(null, mapActions)(Topic);
