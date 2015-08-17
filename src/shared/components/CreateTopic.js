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
      // simpleDeepCopy is used to make sure no reference is passed (otherwise editing one atom edits another)
      atoms: [...this.state.atoms, {type, content: this.atomCreators[type].defaultContent}]
    });
  }
  
  removeAtom(i) {
    const { atoms } = this.state;
    this.setState({
      // Array.prototype.splice cannot be used here as it is destructive
      atoms: atoms.slice(0, i).concat(atoms.slice(i + 1, atoms.length))
    });
  }
  
  moveAtomUp(i) {
    const { atoms } = this.state;
    
    if (!i) return;
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
  updateAtom(i, content) {
    const { atoms } = this.state;
    atoms[i].content = content;
    this.setState({ atoms });
  }
  
  renderAtoms(atoms) {
    
    return atoms.map(({type, content}, i) => {
      const { atomCreators, updateAtom, moveAtomUp, moveAtomDown, removeAtom } = this;
      
      return <div key={i} className='createTopic_atom'>
        <button className='createTopic_atom_up' onClick={moveAtomUp.bind(this, i)}>↑</button>
        <button className='createTopic_atom_down' onClick={moveAtomDown.bind(this, i)}>↓</button>
        <button className='createTopic_atom_remove' onClick={removeAtom.bind(this, i)}>x</button>
        { /* Selects correct ReactClass from type and passes a update function so the child can update its parent's state */ }
        { React.createElement(atomCreators[type], {content, ref: i, update: updateAtom.bind(this, i)}) }
        <hr/>
      </div>;
    });
  }
  
  renderButtons(atomCreators) {
    const ac = this.atomCreators;
    return Object.keys(ac).map(key => 
      <button key={key} onClick={this.addAtom.bind(this, key)}>
        { ac[key].buttonCaption }
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
          { this.renderButtons() }
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
