import React from 'react';

class NewTopic extends React.Component {
  
  constructor() {
    super();
    
    this.handleInputTitle = event => this.setState({title: event.target.value});
    this.handleInputContent = event => this.setState({content: event.target.value});
    this.handleSubmit = event => {
      event.preventDefault();
      this.state.universeId = this.props.universe.id;
      this.props.createTopic(this.state);
    }
    
    this.state = {
      title:   'Topic Title',
      content: 'Awesomeness',
      userId:  'johnDoe'
    };
  }
  
  render() {
    const {title, content, author} = this.state;
        
    return (
      <div className='topic'>
        <form className='topicFrom' onSubmit={this.handleSubmit}>
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
          
          <div className="topic_submit">
            <input type='submit' value='Share Topic !' />
          </div>
        </form>
    </div>
    );
  }
}

export default NewTopic;