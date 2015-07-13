import React from 'react';
import {Link} from 'react-router';

class NewUniverse extends React.Component {
  
  constructor() {
    super();
    
    this.handleInputName = event => { this.setState({name: event.target.value}) };
    this.handleInputDescription = event => { this.setState({description: event.target.value}) };
    this.handleInputParents = event => { this.setState({parents: event.target.value}) };
    this.handleSubmit = () => this.props.actions.newUniverse();
    
    this.state = {
      name: '',
      description: 'Awesomeness',
      parents: '',
    };
  }
  
  componentDidMount() {
    this.setState({
      name: (Math.random() + 1).toString(36).substring(2, 14)
      .replace((Math.random() + 1).toString(36).substring(2, 3), ' ')
      .replace((Math.random() + 1).toString(36).substring(2, 3), ' ')
      .replace((Math.random() + 1).toString(36).substring(2, 3), ' ')
      .replace((Math.random() + 1).toString(36).substring(2, 3), ' ')
      .replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
      .trim()
    });
  }
  
  render() {
    let divStyle = {
      width: '60%',
      margin: '20 auto 0 auto',
      fontSize: '2rem',
    };
    
    const {name, description, parents} = this.state;
    
    return (
      <div style={divStyle} >
        <Link to='explore'>Back</Link>
        <h1>Create New Universe</h1>
        <div>
          <div>Name (unique)</div>
          <input type="text" value={name} onChange={this.handleInputName} />
        </div>
        <br />
        <div>
          <div>Description</div>
          <input type="text" value={description} onChange={this.handleInputDescription} />
        </div>
        <br />
        <div>
          <div>Parent universes</div>
          <input type="text" value={parents} onChange={this.handleInputParents} />
        </div>
        <br />
        <button type="button" onClick={this.handleSubmit}>Submit</button>
      </div>
    );
  }
}

export default NewUniverse;