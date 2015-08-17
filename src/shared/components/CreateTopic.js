import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createTopic } from '../actionCreators';
import { randomInteger, randomText } from '../utils/randomGenerators';

export default class CreateTopic extends React.Component {
  
  constructor() {
    super();
    
    this.handleInputTitle = e => this.setState({title: e.currentTarget.value});
    this.handleInputContent = e => this.setState({content: e.currentTarget.value});
    this.handleSubmit = e => {
      e.preventDefault();
      const { content, title } = this.state;
      const { universe: { id }, createTopic } = this.props;
      
      createTopic({
        title,
        universeId: id,
        atoms: [ // à gen dynamiquement
          {
            type: 'text', 
            content: {text: content}, 
          },
          {
            type: 'text',
            content: {text: 'Second atom of text'},
          }
        ],
      });
    };
    
    this.state = {
      title:   randomText(randomInteger(1, 10)),
      content: randomText(randomInteger(5, 500)),
    };
  }
  
  render() {
    const { title, content } = this.state;
    const { userId } = this.props;
    
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

const mapActions = dispatch => bindActionCreators({ createTopic }, dispatch);

export default connect(null, mapActions)(CreateTopic);
