import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { readTopic, readTopicAtoms } from '../actionCreators';
import { getAtomViewers } from './atoms';

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
    const { universe, topic, topicId, readTopic, readTopicAtoms } = this.props;
    this.atoms = getAtomViewers(universe);
    if (!topic) readTopic(topicId);
    else if (!topic.atoms) readTopicAtoms(topicId);
  }
  
  renderAtoms(atoms) {
    return atoms.map(({type, content}, i) => 
      <div key={i}>
        { React.createElement(this.atoms[type], {content}) }
      </div>
    );
  }
  
  render() {
    const { topic } = this.props || {};
    const { title, userId, createdAt } = topic;
    const atoms = topic.atoms || [{type: 'text', content: {text: 'Loading...'}}];
    
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
            { this.renderAtoms(atoms) }
          </div>
        </div>
          
      </div>
    );
  }
}

const mapActions = dispatch => bindActionCreators({ readTopic, readTopicAtoms }, dispatch);

export default connect(null, mapActions)(Topic);
