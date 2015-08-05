import React from 'react';
import {randomInteger, randomText} from '../utils/randomGenerators';

export default class NewTopic extends React.Component {
  
  constructor() {
    super();
    
    this.handleInputTitle = e => this.setState({title: e.target.value});
    this.handleInputContent = e => this.setState({content: e.target.value});
    this.handleSubmit = e => {
      e.preventDefault();
      const {universe, createTopic} = this.props;
      const {title, content} = this.state;
      const topicId = title.trim().substr(0, 30).replace(' ','_');
      this.state.id = topicId;
      this.state.universeId = universe.id;
      this.state.description = content.substr(0, 600);
      this.state.userId = this.props.session.userId;
      /**
       * TODO :
       * create a function that modify the content to match atom like version 
       * --> [{'atom_type':'sub_content'}] */
      this.state.content = [{type: 'text', text: content}];
      createTopic(this.state);
    };
    
    this.state = {
      title:   randomText(randomInteger(1, 10)),
      content: randomText(randomInteger(5, 500)),
      picture: ''
    };
  }
  
  render() {
    const {title, content} = this.state;
    const userId = this.props.session.userId;
    const rules = "Rules: please don't hate";
    const s1 = {width: '100%'};
    const s2 = {width: '100%', minHeight: '33%'};
    
    return (
      <div className='topic'>
        <form className='topicForm' onSubmit={this.handleSubmit}>
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
