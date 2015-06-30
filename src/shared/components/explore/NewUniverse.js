import React from 'react';

class NewUniverse extends React.Component {
  
  constructor() {
    super();
    
    this.handleInputName = (event) => { this.setState({newUniverseName: event.target.value}) };
    this.handleInputDescription = (event) => { this.setState({newUniverseDescription: event.target.value}) };
    this.handleSubmit = () => {
      this.props.actions.newUniverse();
    };
    
    this.state = {
      newUniverseName: 'Awesomeness',
      newUniverseDescription: 'Some description'
    };
  }
  
  render() {
    let divStyle = {
      marginTop: '3rem',
    };
    
    let newUniverseName = this.state.newUniverseName;
    let newUniverseDescription = this.state.newUniverseDescription;
    
    return (
      <div style={divStyle} >
        <span>Create New Universe</span>
        <div>
          <span>Name (unique)</span>
          <input type="text" value={newUniverseName} onChange={this.handleInputName} />
        </div>
        <div>
          <span>Description</span>
          <input type="text" value={newUniverseDescription} onChange={this.handleInputDescription} />
        </div>
        <button type="button" onClick={this.handleSubmit}>Submit</button>
      </div>
    );
  }
}

NewUniverse.defaultProps = {
};

export default NewUniverse;