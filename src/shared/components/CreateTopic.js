import React from 'react';
import validate from 'validate.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createTopic } from '../actionCreators';
import { getAtomCreators, getAtomViewers, validateAtoms } from './atoms';
import { deepCopy, deepMerge } from '../utils/objectUtils';

// Atom shape:
// type: string
// state: object
// content: object
// shouldGetReady: boolean
// validationErrors: object or undefined
// ready: 'yes' || 'no' || 'pending' || 'error'

export default class CreateTopic extends React.Component {
  
  constructor() {
    super();
    this.state = { 
      atoms: [],
      title: 'abc', 
      atomsShouldGetReady: false,
    };
  }
  
  componentWillMount() {
    const { id } = this.props.universe;
    this.atomViewers = getAtomViewers(id);
    this.atomCreators = getAtomCreators(id);
  }
  
  callCreateTopic() {
    console.log('createTopic');
    const { title, atoms } = this.state;
    const { universe: { id }, createTopic } = this.props;
    
    createTopic({
      title,
      universeId: id,
      atoms: atoms.map(({type, content}) => ({type, content})), // only the best part goes up
    });
  }
  
  handleSubmitClick(e) {
    if (!this.state.title) return; // :( A BOUGER !!!
    
    const { atoms } = this.state;
    const validationErrors = validateAtoms(atoms);
    const atomsShouldGetReady = validationErrors.every(error => !error);
    
    
    this.setState(
      {
        atomsShouldGetReady,
        atoms: atoms.map(({type, ready, content, state}, i) => ({
          type,
          ready,
          state,
          content,
          // shouldGetReady: atomsShouldGetReady,
          validationErrors: validationErrors[i],
        }))
      }, 
      () => {
        if (atoms.length && atomsShouldGetReady && atoms.every(a => a.ready === 'yes')) this.callCreateTopic();
      }
    );
  }
  
  handleTitleInput(e) {
    this.setState({
      title: e.currentTarget.value
    });
  }
  
  addAtom(type) {
    this.setState({ 
      atoms: [...this.state.atoms, {
        type,
        ready: 'no', // wasn't born ready
        // shouldGetReady: false,
        state: deepCopy(this.atomCreators[type].initialState),
        content: deepCopy(this.atomCreators[type].initialContent),
      }]
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
  
  // Updates this component state when an AtomCreator call this.props.update()
  updateAtom(i, {content, state, ready}, callback) {
    
    const { atoms, atomsShouldGetReady } = this.state;
    const newAtoms = deepCopy(atoms); // if you mutate your state you go to React hell
    const atom = newAtoms[i];
    
    // This filters the second arg's keys, allowing only content, state and ready to be mutated
    if (content) deepMerge(atom.content, content);
    if (state) deepMerge(atom.state, state);
    if (ready !== undefined) atom.ready = ready;
    
    this.setState({ atoms: newAtoms }, () => {
      
      if (typeof callback === 'function') callback();
      if (atomsShouldGetReady) {
        const readyStates = newAtoms.map(atom => atom.ready);
        
        if (readyStates.every(ready => ready === 'yes')) this.callCreateTopic();
        else if (readyStates.some(ready => ready === 'error')) this.setState({
          atomsShouldGetReady: false,
        });
      }
    });
    
  }
  
  renderAddAtomsButtons() {
    const { atomCreators, addAtom } = this;
    
    return Object.keys(atomCreators).map(key => 
      <input 
        key={key}
        type='button'
        onClick={addAtom.bind(this, key)}
        disabled={this.state.atomsShouldGetReady}
        value={atomCreators[key].buttonCaption}
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
          value={atomsShouldGetReady ? 'Loading...' : 'Create Topic'}
          disabled={atomsShouldGetReady}
          onClick={this.handleSubmitClick.bind(this)}
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
        { JSON.stringify(atom) }
      </div>
      <Creator {...atom} update={update} atomsShouldGetReady={atomsShouldGetReady} />
      <hr />
    </div>;
  }
}

const mapActions = dispatch => bindActionCreators({ createTopic }, dispatch);
export default connect(null, mapActions)(CreateTopic);
