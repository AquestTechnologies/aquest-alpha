import React from 'react';

class NewTopic extends React.Component {
  
  constructor() {
    super();
    
    this.handleInputTitle = event => this.setState({title: event.target.value});
    this.handleInputContent = event => this.setState({content: event.target.value});
    this.handleSubmit = () => this.props.newTopic(this.state);
    
    this.state = {
      title:    'Topic Title',
      content:  'Awesomeness',
      author:   'johnDoe',
    };
  }
  
  render() {
    const {title, content, author} = this.state;
    
    return (
      <div className='topic'>
      
        <div className="newTopic_rules">
          {'Rules: please don\'t hate'}
        </div>
      
        <div className="topic_title">
          <input type="text" value={title} onChange={this.handleInputTitle} />
        </div>
        
        <div className="topic_author">
          {`By ${author}`}
        </div>
        
        <div className="topic_content">
          <input type="text" value={content} onChange={this.handleInputContent} />
        </div>
    </div>
    );
  }
}

export default NewTopic;