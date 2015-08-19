import React from 'react';
import validate from 'validate.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createTopic } from '../actionCreators';
import { getAtomCreators, getAtomValidationConstraints } from './atoms';
import { deepCopy } from '../utils/objectUtils';

export default class CreateTopic extends React.Component {
  
  constructor() {
    super();
    this.state = { title: 'abc', atoms: [] };
  }
  
  componentWillMount() {
    const { universe } = this.props;
    this.atomCreators = getAtomCreators(universe);
    this.atomValidationConstraints = getAtomValidationConstraints(universe);
  }
  
  handleSubmit(e) {
    // We should make sure the user can post only once 
    // (by disabling every UI thing between REQUEST and SUCCESS for example)
    if (!this.state.title) return; // :(
    
    this.validateAtoms().then(
      validated => {
        if (validated) {
          const { title, atoms } = this.state;
          const { universe: { id }, createTopic } = this.props;
          
          createTopic({
            title,
            atoms,
            universeId: id,
          });
        }
      }
    );
  }
  
  validateAtoms() {
    // I had to use a Promise because setState is async :/
    // return true/false did not work
    return new Promise(resolve => {
      const { atoms } = this.state;
      const validationErrors = atoms.map(({type, content}) => validate(content, this.atomValidationConstraints[type]));
      
      if (validationErrors.every(error => !error)) this.setState({
        // removes validationErrors
        atoms: atoms.map(({type, content}) => ({
          type,
          content,
        }))
      }, resolve.bind(null, true));
      else this.setState({
        atoms: atoms.map(({type, content}, i) => ({
          type,
          content,
          validationErrors: validationErrors[i],
        }))
      }, resolve.bind(null, false));
    });
  }
  
  handleInputTitle(e) {
    this.setState({
      title: e.currentTarget.value
    });
  }
  
  addAtom(type) {
    const newAtom = {
      type,
      content: deepCopy(this.atomCreators[type].initialContent),
    };
    this.setState({
      atoms: [...this.state.atoms, newAtom]
    });
  }
  
  removeAtom(i) {
    const { atoms } = this.state;
    this.setState({
      // Array.prototype.splice cannot be used here since it is destructive
      atoms: atoms.slice(0, i).concat(atoms.slice(i + 1, atoms.length))
    });
  }
  
  // Moves atoms[i] to atoms[i + n]
  moveAtom(i, n) {
    
    const atoms = deepCopy(this.state.atoms);
    // Checks for outer limits exeptions
    if ((n < 0 && n + i < 0) || (n > 0 && n + i > atoms.length - 1)) return;
    
    const x = atoms[i + n];
    atoms[i + n] = atoms[i];
    atoms[i] = x;
    
    this.setState({atoms});
  }
  
  // Updates this component state when atom child call this.props.update()
  updateAtom(i, content, callback) {
    const atoms = deepCopy(this.state.atoms);
    atoms[i].content = content;
    this.setState({ atoms }, callback);
  }
  
  renderAtoms(atoms) {
    
    return atoms.map(({type, content, validationErrors}, i) => {
      const Creator = this.atomCreators[type];
      
      return(
        <div key={i}>
          <button onClick={this.moveAtom.bind(this, i, -1)}>↑</button>
          <button onClick={this.moveAtom.bind(this, i, 1)}>↓</button>
          <button onClick={this.removeAtom.bind(this, i)}>x</button>
          <Creator content={content} validationErrors={validationErrors} update={this.updateAtom.bind(this, i)}/>
          <hr/>
        </div>
      );
    }
    );
  }
  
  renderAddAtomsButtons() {
    const { atomCreators, addAtom } = this;
    return Object.keys(atomCreators).map(key => 
      <button key={key} onClick={addAtom.bind(this, key)}>
        { atomCreators[key].buttonCaption }
      </button>
    );
  }
  
  render() {
    const { title, atoms } = this.state;
    const { userId, universe: {rules} } = this.props;
    
    const titleStyle = {
      width: '100%',
      resize: 'none',
      outline: 'none',
      overflow: 'auto',
      border: 'none',
    };
    
    return (
      <div className='topic'>
        <div className="createTopic_rules">
          {`Rules: ${rules}`}
        </div>
        
        <div className="topic_title">
          <textarea 
            type="text" 
            value={title} 
            onChange={this.handleInputTitle.bind(this)} 
            placeholder='Enter your title here'
            style={titleStyle}
          />
        </div>
        
        <div className="topic_author">
          {`By ${userId}`}
          {' - '}
          { this.renderAddAtomsButtons() }
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
