import React from 'react';

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
    // console.log('.C. Topic.componentWillMount');
    const {id, content} = this.props.topics[this.props.params.topicId];
    if (!content) this.props.readTopicContent(id);
  }
  
  // componentWillReceiveProps(nextProps) {
  //   this.setState({ topic: nextProps.topic });
  // }
  
  render() {
    const topic = this.props.topics[this.props.params.topicId];
    const {title, author, timestamp} = topic;
    const content = topic.content || ['Loading...'];
    
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