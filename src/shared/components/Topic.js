import React from 'react';
import {Link} from 'react-router';

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
  
  // ALERTE GROS BUG !!
  // faire : startups > topic > bouton back UI > autre topic puis 2 fois history back !!!!
  // Normalement c'est la merde
  // Sauf que pour l'instant il n'y a pas de bouton back UI
  render() {
    // Pas ouf
    const topic = this.props.topics[this.props.params.topicId];
    
    return (
      <div>
        <div className="topic" style={{fontSize: '2rem'}}>
          <Link to='universe' params={{universeId: this.props.universe.id}}>
            Back to {this.props.universe.name}
          </Link>
          <div className="topic_title">
            {topic.title}
          </div>
          <div className="topic_author">
            {topic.author}
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