import React from 'react';
import {Link} from 'react-router';

class NewUniverse extends React.Component {
  
  constructor() {
    super();
    
    this.handleInputName = event => this.setState({name: event.target.value});
    this.handleInputDescription = event => this.setState({description: event.target.value});
    this.handleInputRelated = event => this.setState({related: event.target.value});
    this.handleSubmit = () => this.props.createUniverse(this.state);
    
    this.state = {
      name: '',
      description: 'Awesomeness',
      related: '',
      userId: 'johnDoe'
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
    
    const {name, description, related} = this.state;
    
    return (
      <div style={divStyle} >
        <Link to='explore'>Back</Link>
        <h1>Create New Universe</h1>
        <form className='universeFrom' onSubmit={this.handleSubmit}>
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
            <div>Related universes</div>
            <input type="text" value={related} onChange={this.handleInputRelated} />
          </div>
          <br />
          <input type="submit" value='Create universe' />
        </form>
      </div>
    );
  }
}

export default NewUniverse;