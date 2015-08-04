import React from 'react';
import {Link} from 'react-router';
import { randomText, randomInteger } from '../utils/randomGenerators';

export default class NewUniverse extends React.Component {
  
  constructor() {
    super();
    
    this.handleInputName = event => this.setState({name: event.currentTarget.value});
    this.handleInputDescription = event => this.setState({description: event.currentTarget.value});
    this.handleInputRelated = event => this.setState({related: event.currentTarget.value});
    this.handleSubmit = event => {
      event.preventDefault();
      this.props.createUniverse(this.state);
    };
    
    this.state = {
      name: '',
      description: '',
      related: '',
      picture: 'img/pillars_compressed.png',
    };
  }
  
  componentDidMount() {
    this.setState({
      name: randomText(randomInteger(1, 3)).slice(0, -1),
      description: randomText(randomInteger(1, 70))
    });
  }
  
  render() {
    const divStyle = {
      width: '60%',
      margin: '20 auto 0 auto',
      fontSize: '2rem',
    };
    
    const {name, description, related} = this.state;
    
    return (
      <div style={divStyle} >
        <Link to='Explore'>Back</Link>
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
