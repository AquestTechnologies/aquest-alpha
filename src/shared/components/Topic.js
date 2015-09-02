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
    const { emitCreateVoteTopic, emitDeleteVoteTopic, voteContextId, universeId, userId: sessionUserId } = this.props;
    const { topic } = this.props || {};
    const { title, userId, createdAt, id: topicId } = topic;
    const atoms = topic.atoms || [{type: 'text', content: {text: 'Loading...'}}];
    
    const vote = this.props.vote || { 'Thanks': [], 'Agree': [], 'Disagree': [], 'Irrelevant': [], 'Shocking': [] };
    if (!vote[universeId]) vote[universeId] = []; 
    
    const voteTargetContext = {voteContextId, topicId};
    
    return !topic ? <div>Loading...</div> : (
      <div>
        <div className="topic">
          <div className="vote">
            { Object.keys(vote).map( (key) =>
              <Vote 
                id={key}
                key={key}
                users={vote[key]}
                universeId={universeId} // not really necessary, depends on the database query optimization
                sessionUserId={sessionUserId}
                createVote={emitCreateVoteTopic}
                deleteVote={emitDeleteVoteTopic}
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
