import React from 'react';
import {randomInteger, randomText} from '../utils/randomGenerators';

class NewTopic extends React.Component {
  
  constructor() {
    super();
    
    this.handleInputTitle = e => this.setState({title: e.target.value});
    this.handleInputContent = e => this.setState({content: e.target.value});
    this.handleSubmit = e => {
      e.preventDefault();
      const universeId = this.props.universe.id;
      const {title, content} = this.state;
      const topicId = title.substr(0, 12).replace(' ','_');
      this.state.id = topicId;
      this.state.universeId = universeId;
      this.state.description = content.substr(0, 600);
      this.props.createTopic(this.state);
    };
    
    this.state = {
      title:   randomText(randomInteger(1, 10)),
      content: randomText(randomInteger(5, 500)),
      userId:  'johnDoe',
      picture: ''
    };
  }
  
  render() {
    const {title, content, userId} = this.state;
    const rules = "Rules: please don't hate";
    const s1 = {width: '100%'};
    const s2 = {width: '100%', minHeight: '33%'};
    
    return (
      <div className='topic'>
        <form className='topicFrom' onSubmit={this.handleSubmit}>
          <div className="newTopic_rules">
            {rules}
          </div>
          
          <div className="topic_title">
            <textarea type="text" value={title} onChange={this.handleInputTitle} style={s1}/>
          </div>
          
          <div className="topic_author">
            {`By ${userId}`}
          </div>
          
          <div className="topic_content">
            <textarea type="text" value={content} onChange={this.handleInputContent} style={s2}/>
          </div>
          <br/>
          <div className="topic_submit">
            <input type='submit' value='Share Topic !' />
          </div>
        </form>
    </div>
    );
  }
}

NewTopic.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default NewTopic;
