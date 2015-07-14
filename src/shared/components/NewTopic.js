import React from 'react';

class NewTopic extends React.Component {
  
  constructor() {
    super();
    
    this.handleInputTitle = event => this.setState({title: event.target.value});
    this.handleInputContent = event => this.setState({content: event.target.value});
    this.handleSubmit = () => this.props.actions.newTopic(this.state);
    
    this.state = {
      title:    'Topic Title',
      content:  'Awesomeness',
      author:   'ici mettre le userId',
    };
  }
  
  render() {
    const {title, content} = this.state;
    
    return (
      <div className='topic'>
      
        <div className="newTopic_rules">
          {'Rules: please don\'t hate'}
        </div>
      
        <div className="topic_title">
          {title}
        </div>
        
        <div className="topic_author">
          {'By you, in a minute'}
        </div>
        
        <div className="topic_content">
          {content}
        </div>
    </div>
    );
  }
}

export default NewTopic;