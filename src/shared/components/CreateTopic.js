import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createTopic } from '../actionCreators';
import { deepCopy } from '../utils/objectUtils';

const defaultAtomContent = {
  text: {
    text: ''
  }
};

export default class CreateTopic extends React.Component {
  
  constructor() {
    super();
    this.state = {
      title: '',
      atoms: [{
        type: 'text',
        content: {text: ''}
      }],
    };
  }
  
  handleInputTitle(e) {
    this.setState({
      title: e.currentTarget.value
    });
  }
  
  addAtom(type) {
    
    this.setState({
      // simpleDeepCopy is used to make sure no reference is passed (otherwise editing one atom edits another)
      atoms: [...this.state.atoms, {type, content: deepCopy(defaultAtomContent[type])}]
    });
  }
  
  removeAtom(i) {
    const { atoms } = this.state;
    this.setState({
      // Array.prototype.splice cannot be used here as it is destructive
      atoms: atoms.slice(0, i).concat(atoms.slice(i + 1, atoms.length))
    });
  }
  
  handleSubmit(e) {
    const { title, atoms } = this.state;
    const { universe: { id }, createTopic } = this.props;
    createTopic({
      title,
      atoms,
      universeId: id, // confiance à l'utilisateur ?
    });
  }
  
  
  createTextAreaInputHandler(i) {
    return e => {
      console.log('changed', i);
      const { atoms } = this.state;
      const textarea = e.currentTarget;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight;
      atoms[i].content.text = textarea.value;
      this.setState({ atoms });
    };
  }
  
  renderAtoms(atoms) {
    const textareaStyle = {
      width: '100%', 
      height: 'auto', 
      resize: 'none',
      outline: 'none',
      overflow: 'hidden',
      border: 'none',
    };
    
    return atoms.map(({type, content}, i) => {
      let core;
      switch (type) {
      
      case 'text':
        core = <textarea 
          type='text'  
          value={content.text} 
          onChange={this.createTextAreaInputHandler(i)} 
          autoComplete='false'
          placeholder='Write your content here'
          style={textareaStyle} />;
        break;
      
      }
      
      return <div key={i} className='createTopic_atom'>
        <button className='createTopic_atom_remove' onClick={this.removeAtom.bind(this, i)}>x</button>
        { core }
        <hr/>
      </div>;
    });
  }
  
  render() {
    const { title, atoms } = this.state;
    const { userId, universe: {rules} } = this.props;
    
    const s1 = {
      width: '100%',
      resize: 'none',
      outline: 'none',
      overflow: 'auto',
    };
    
    return (
      <div className='topic'>
        <div className="createTopic_rules">
          {`Rules: ${rules}`}
        </div>
        
        <div className="topic_title">
          <textarea type="text" value={title} onChange={this.handleInputTitle.bind(this)} style={s1}/>
        </div>
        
        <div className="topic_author">
          {`By ${userId}`}
          {' - '}
          <button onClick={this.addAtom.bind(this, 'text')}>+ text</button>
          <button onClick={this.addAtom.bind(this, 'image')}>+ image</button>
          <button onClick={this.addAtom.bind(this, 'youtube')}>+ youtube</button>
        </div>
        
        <div className="topic_atoms">
          { this.renderAtoms(atoms) }
        </div>
        <br/>
        <div className="topic_submit">
          <button onClick={this.handleSubmit.bind(this)}>Create Topic</button>
        </div>
    </div>
    );
  }
}

const mapActions = dispatch => bindActionCreators({ createTopic }, dispatch);

export default connect(null, mapActions)(CreateTopic);
