import React from 'react';
import validate from 'validate.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createTopic } from '../actionCreators';
import { getAtomCreators, getAtomViewers, getAtomsValidationErrors } from './atoms';
import { deepCopy, deepMerge } from '../utils/objectUtils';

// Atom shape:
// type: string
// state: object
// content: object
// validationErrors: object or undefined
// ready: 'yes' || 'no' || 'pending' || 'error'

export default class CreateTopic extends React.Component {
  
  constructor() {
    super();
    this.state = { 
      atoms: [],
      title: 'Aquest', 
      atomsShouldGetReady: false,
    };
  }
  
  // Gets the Creators and Viewers only on client
  componentWillMount() {
    const { id } = this.props.universe;
    this.atomViewers = getAtomViewers(id);
    this.atomCreators = getAtomCreators(id);
  }
  
  // Calls the creation action
  callCreateTopic() {
    console.log('createTopic');
    const { title, atoms } = this.state;
    const { createTopic, universe: { id } } = this.props;
    
    createTopic({
      title,
      universeId: id,
      atoms: atoms.map(({type, content}) => ({type, content})), // Only the best part goes up
    });
  }
  
  handleTitleInput(e) {
    this.setState({
      title: e.currentTarget.value
    });
  }
  
  // On submit click, validates the atoms and tell them to get ready
  handleSubmitClick(e) {
    if (!this.state.title) return; // :( A BOUGER !!!
    
    const { atoms } = this.state;
    const validationErrors = getAtomsValidationErrors(atoms);
    const atomsShouldGetReady = validationErrors.every(error => !error); // No error? get ready.
    
    this.setState(
      {
        atomsShouldGetReady, // This should disable the UI somehow, so the user cannot modify anything while atoms are getting ready
        atoms: atoms.map(({type, ready, content, state}, i) => ({
          type,
          ready,
          state,
          content,
          validationErrors: validationErrors[i], // Keyed object or undefined
        }))
      }, 
      () => { // If every atom is ready then we create the topic.
        if (atoms.length && atomsShouldGetReady && atoms.every(a => a.ready === 'yes')) this.callCreateTopic();
      }
    );
  }
  
  // Appends a new atom a the end of the list
  addAtom(type) {
    this.setState({ 
      atoms: [...this.state.atoms, {
        type,
        ready: 'no', // Wasn't born ready
        state: deepCopy(this.atomCreators[type].initialState), // deepCopy to get rid of the reference
        content: deepCopy(this.atomCreators[type].initialContent),
      }]
    });
  }
  
  // Removes atom at position i
  removeAtom(i) {
    const { atoms } = this.state;
    this.setState({
      // Array.prototype.splice cannot be used here since it is mutative
      atoms: atoms.slice(0, i).concat(atoms.slice(i + 1, atoms.length))
    });
  }
  
  // Moves atoms[i] to atoms[i + n]
  moveAtom(i, n) {
    const j = i + n;
    const atoms = deepCopy(this.state.atoms); // If you mutate your state you go to React hell
    
    // Checks for outer limits exeptions
    if (j < 0 || j > atoms.length - 1) return;
    
    const x = atoms[j];
    atoms[j] = atoms[i];
    atoms[i] = x;
    this.setState({ atoms });
  }
  
  // Updates this component's state when an AtomCreator calls this.props.update()
  updateAtom(i, {content, state, ready}, callback) {
    
    const { atoms, atomsShouldGetReady } = this.state;
    const newAtoms = deepCopy(atoms);
    const atom = newAtoms[i];
    
    // Only content, state and ready are allowed to be mutated
    if (content) deepMerge(atom.content, content); // Object.assign here would be better
    if (state) deepMerge(atom.state, state);
    if (ready !== undefined) atom.ready = ready;
    
    this.setState({ atoms: newAtoms }, () => {
      
      if (typeof callback === 'function') callback();
      if (atomsShouldGetReady) {
        
        // If every atom is now good to go
        if (newAtoms.every(({ ready }) => ready === 'yes')) this.callCreateTopic();
        
        // If one of them has some error, we go back to the editing state
        else if (newAtoms.some(({ ready }) => ready === 'error')) this.setState({
          atomsShouldGetReady: false,
        });
      }
    });
    
  }
  
  // Dynamically renders the 'new atom' buttons based on the universe's atoms
  renderAddAtomsButtons() {
    const { atomCreators, addAtom } = this;
    
    return Object.keys(atomCreators).map(key => 
      <input 
        key={key}
        type='button'
        onClick={addAtom.bind(this, key)}
        value={atomCreators[key].buttonCaption}
        disabled={this.state.atomsShouldGetReady}
      />
    );
  }
  
  render() {
    const { title, atoms, atomsShouldGetReady } = this.state;
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
            onChange={this.handleTitleInput.bind(this)} 
            placeholder='Enter your title here'
            style={titleStyle}
          />
        </div>
        
        <div className="topic_author">
          {`By ${userId} - `}
          { this.renderAddAtomsButtons() }
        </div>
        
        <div className="topic_atoms">
          {
            atoms.map((atom, i) => {
              
              const { type, content, ready } = atom;
              const Viewer = this.atomViewers[type];
              
              return atomsShouldGetReady && ready === 'yes' ? // Viewer will be wrapped I think
                <Viewer 
                  key={i}
                  content={content} 
                />
                :
                <AtomCreatorWrapper
                  key={i}
                  atom={atom}
                  atomsShouldGetReady={atomsShouldGetReady}
                  Creator={this.atomCreators[type]}
                  update={this.updateAtom.bind(this, i)}
                  remove={this.removeAtom.bind(this, i)}
                  moveUp={this.moveAtom.bind(this, i, -1)}
                  moveDown={this.moveAtom.bind(this, i, 1)}
                />;
            })
          }
        </div>
        
        <br/>
        <input 
          type='button'
          disabled={atomsShouldGetReady}
          onClick={this.handleSubmitClick.bind(this)}
          value={atomsShouldGetReady ? 'Loading...' : 'Create Topic'}
        />
      </div>
    );
  }
}

class AtomCreatorWrapper extends React.Component {
  
  constructor() {
    super();
    this.state = { commandsVisible: false };
  }
  
  handleHover(commandsVisible) {
    this.setState({ commandsVisible });
  }
  
  render() {
    const {Creator, atom, moveUp, moveDown, remove, update, atomsShouldGetReady} = this.props;
    const commandsStyle = {
      visibility: this.state.commandsVisible && !atomsShouldGetReady ? 'visible' : 'hidden'
    };
    
    return <div onMouseOver={this.handleHover.bind(this, true)} onMouseOut={this.handleHover.bind(this, false)}>
      <div style={commandsStyle}>
        <button onClick={moveUp}>↑</button>
        <button onClick={moveDown}>↓</button>
        <button onClick={remove}>x</button>
      </div>
      <div>
        { JSON.stringify(atom) /* debug */ }
      </div>
      <Creator {...atom} update={update} atomsShouldGetReady={atomsShouldGetReady} />
      <hr />
    </div>;
  }
}

const mapActions = dispatch => bindActionCreators({ createTopic }, dispatch);
export default connect(null, mapActions)(CreateTopic);
