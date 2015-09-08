import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { readTopic, readTopicAtoms } from '../actionCreators';
import { getAtomViewers } from './atoms';
import Ballot from './common/Ballot';

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
    this.atomViewers = getAtomViewers(universe);
    if (!topic) readTopic(topicId);
    else if (!topic.atoms) readTopicAtoms(topicId);
  }
  
  componentDidMount() {
    const { topic: {id}, emitJoinVote } = this.props;
    emitJoinVote(`topic-${id}`);
  }
  
  componentWillUnmount(){
    const { topic: {id}, emitLeaveVote } = this.props;
    emitLeaveVote(`topic-${id}`);
  }
  
  renderAtoms(atoms) {
    
    return atoms.map(({type, content}, i) => {
      const Viewer = this.atomViewers[type];
      
      return <Viewer key={i} content={content} />;
    });
  }
  
  render() {
    const { emitCreateVoteTopic, voteContextId, userId: sessionUserId, ballot } = this.props;
    const { topic } = this.props || {};
    const { title, userId, createdAt, id: topicId, vote } = topic;
    const atoms = topic.atoms || [{type: 'text', content: {text: 'Loading...'}}];
    
    const voteTargetContext = {voteContextId, topicId};
    
    return !topic ? <div>Loading...</div> : (
      <div>
        <div className="topic">
          <div className="vote">
            { ballot.map( ({id, content, value, position, description}) =>
              <Ballot 
                id={id}
                key={id}
                value={value}
                ballotId={id}
                content={content}
                position={position}
                description={description}
                vote={(vote || {})[id] || []}
                sessionUserId={sessionUserId}
                createVote={emitCreateVoteTopic}
                voteTargetContext={voteTargetContext}
              />)
            }
          </div>
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
