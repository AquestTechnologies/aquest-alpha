import React from 'react';

class Topic extends React.Component {
  
  // Load les données initiales
  static runPhidippides(routerState) {
    return [{
      id:         'topic',
      creator:    'loadTopicByHandle',
      args:       [routerState.params.topicHandle]
    }];
  }
  
  /*constructor() {
    super();
    this.state = { topic: {} };
  }*/
  
  /*componentWillMount() {
    if (!this.props.topic.content) this.props.loadTopicContent(this.props.topic.handle);
    this.setState({ topic: this.props.topic });
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({ topic: nextProps.topic });
  }*/
  
  // ALERTE GROS BUG !!
  // faire : startups > topic > bouton back > autre topic puis 2 fois history back !!!!
  // Normalement c'est la merde
  // Sauf que pour l'instant il n'y a pas de bouton back
  render() {
    // Pas ouf
    const topic = this.props.universe.topics.filter(topic => topic.handle === this.props.params.topicHandle)[0];
    
    return (
      <div>
        
        <div className="topic">
          <div className="topic_title">
            {topic.title}
          </div>
          <div className="topic_author">
            {topic.author}
          </div>
          <div className="topic_content">
            {topic.content}
          </div>
        </div>
          
      </div>
    );
  }
}

Topic.defaultProps = {
  universe: {},
  topic: {
   title: 'A default title is better than no title!' ,
   author: 'Someone',
   timestamp: '0',
   content: 'Hello world',
   handle: '000-A default'
  }
};

// Permet d'acceder a this.context.router
Topic.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default Topic;