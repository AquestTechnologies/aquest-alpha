import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createTopic } from '../actionCreators';
import { getAtomCreators } from './atoms';

export default class CreateTopic extends React.Component {
  
  constructor() {
    super();
    this.state = { title: '', atoms: [] };
  }
  
  componentWillMount() {
    this.atomCreators = getAtomCreators(this.props.universe);
  }
  
  handleSubmit(e) {
    // We should make sure the user can post only once 
    // (by disabling every UI thing between REQUEST and SUCCESS for example)
    const { title, atoms } = this.state;
    const { universe: { id }, createTopic } = this.props;
    createTopic({
      title,
      atoms,
      universeId: id,
    });
  }
  
  handleInputTitle(e) {
    this.setState({
      title: e.currentTarget.value
    });
  }
  
  addAtom(type) {
    this.setState({
      atoms: [...this.state.atoms, {type, content: this.atomCreators[type].getDefaultContent()}]
    });
  }
  
  removeAtom(i) {
    const { atoms } = this.state;
    this.setState({
      // Array.prototype.splice cannot be used here since it is destructive
      atoms: atoms.slice(0, i).concat(atoms.slice(i + 1, atoms.length))
    });
  }
  
  moveAtomUp(i) {
    if (!i) return;
    
    const { atoms } = this.state;
    const previousAtom = atoms[i - 1];
    atoms[i - 1] = atoms[i];
    atoms[i] = previousAtom;
    
    this.setState({atoms});
  }
  
  moveAtomDown(i) {
    const { atoms } = this.state;
    
    if (i === atoms.length - 1) return;
    const nextAtom = atoms[i + 1];
    atoms[i + 1] = atoms[i];
    atoms[i] = nextAtom;
    
    this.setState({atoms});
  }
  
  // Updates this component state when atom child call this.props.update()
  updateAtom(i, content, callback) {
    const { atoms } = this.state;
    atoms[i].content = content;
    this.setState({ atoms }, callback);
  }
  
  renderAtoms(atoms) {
    
    return atoms.map(({type, content}, i) =>
      <div key={i} className='createTopic_atom'>
        <button className='createTopic_atom_up' onClick={this.moveAtomUp.bind(this, i)}>↑</button>
        <button className='createTopic_atom_down' onClick={this.moveAtomDown.bind(this, i)}>↓</button>
        <button className='createTopic_atom_remove' onClick={this.removeAtom.bind(this, i)}>x</button>
        { /* Selects correct ReactClass from type and passes a update function so the child can update its parent's state */ }
        { React.createElement(this.atomCreators[type], {content, ref: i, update: this.updateAtom.bind(this, i)}) }
        <hr/>
      </div>
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
