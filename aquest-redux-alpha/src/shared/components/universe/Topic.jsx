import React from 'react';

class Topic extends React.Component {
  
  // Load les données initiales
  static runPhidippides(routerState) {
    if (routerState.c === 1) return [{
      taskName: 'topic',
      dependency: null,
      shouldBePresent: {
        store: 'topicStore',
        data: 'topic',
        shouldHaveValue: null
      },
      ifNot:  {
        actions: 'topicActions',
        creator: 'loadTopicByHandle',
        args : [routerState.params.topicHandle]
      }
    }];
  }
  
  constructor() {
    super();
    this.state = { topic: {} };
  }
  
  componentWillMount() {
    if(!this.props.topic.content)  this.props.actions.loadTopicContent(this.props.topic.handle);
    this.setState({ topic: this.props.topic });
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({ topic: nextProps.topic });
  }
  
  // ALERTE GROS BUG !!
  // faire : startups > topic > bouton back > autre topic puis 2 fois history back !!!!
  // Normalement c'est la merde
  render() {
    let topic = this.state.topic;
    
    return (
      <div className="universe_left" style={{backgroundImage: 'url(' + this.props.universe.picturePath + ')'}}>
        <div className="universe_left_scrollable">
          <div className="universe_left_scrolled">
          
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