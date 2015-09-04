import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createUniverse, readUniverses } from '../actionCreators';
import { randomText, randomInteger } from '../utils/randomGenerators';

const pictures = [
  {
    url: 'http://d2ifokkknaunnx.cloudfront.net/pillars.png',
    name: 'Blue creation',
    description: 'Hubble took this one.',
  },
  {
    url: 'http://d2ifokkknaunnx.cloudfront.net/forest.png',
    name: 'Green forest',
    description: 'Welcome to the jungle.',
  },
  {
    url: 'http://d2ifokkknaunnx.cloudfront.net/designer.png',
    name: 'Orange design',
    description: 'For work or play.',
  },
];

class CreateUniverse extends React.Component {
  
  constructor() {
    super();
    
    this.handleSelectPicture = picture => this.setState({picture});
    this.handleInputName = event => this.setState({name: event.currentTarget.value});
    this.handleInputDescription = event => this.setState({description: event.currentTarget.value});
    
    this.handleInputRelated = event => {
      const { value } = event.currentTarget;
      const related = this.state.related.slice();
      const array = value.split(',');
      const lastIndex = array.length - 1;
      const lastItem = array[lastIndex];
      
      for (let i = 0; i < lastIndex; i++) {
        const universeId = this.inverseUniverses[array[i]];
        if (universeId && related.indexOf(universeId) === -1) related.push(universeId);
      }
      
      this.setState({
        related,
        relatedInputValue: lastItem,
      });
    };
    
    this.handleKeyDownRelated = event => {
      const { keyCode } = event;
      console.log(keyCode);
      const { relatedInputValue, related } = this.state;
      if (keyCode === 8 && !relatedInputValue) this.removeRelated(related.length - 1);
      else if (keyCode === 9 && relatedInputValue) {
        event.preventDefault();
        let added = false;
        const related = this.state.related.slice();
        const universeId = this.inverseUniverses[relatedInputValue];
        if (universeId && related.indexOf(universeId) === -1) { 
          related.push(universeId);
          added = true;
        }
        this.setState({
          related,
          relatedInputValue: added ? '' : relatedInputValue,
        });
      }
    };
    
    this.handleSubmit = event => {
      event.preventDefault();
      const params = Object.assign(this.state);
      delete params.relatedInputValue;
      this.props.createUniverse(params);
    };
    
    this.state = {
      name: '',
      description: '',
      related: [],
      relatedInputValue: '',
      picture: pictures[0].url,
    };
  }
  
  
  componentWillMount() {
    this.createInverseUniverses(this.props.universes);
  }
  
  componentDidMount() {
    if (Object.keys(this.props.universes).length < 2) this.props.readUniverses(); 
    this.setState({
      name: randomText(randomInteger(1, 3)).slice(0, -1),
      description: randomText(randomInteger(1, 30)).substr(0, 200)
    });
  }
  
  componentWillReceiveProps(nextProps) {
    console.log('cwrp');
    const nextUniverses = nextProps.universes;
    const nextKeys = Object.keys(nextUniverses);
    const keys = Object.keys(this.props.universes);
    if (nextKeys.length > keys.length) this.createInverseUniverses(nextUniverses);
  }
  
  createInverseUniverses(universes) {
    const inverseUniverses = {};
    for (let key in universes) {
      if (universes.hasOwnProperty(key)) inverseUniverses[universes[key].name] = key;
    }
    this.inverseUniverses = inverseUniverses;
  }
  
  removeRelated(i) {
    const { related } = this.state;
    this.setState({
      related: related.slice(0, i).concat(related.slice(i + 1, related.length))
    });
  }
  
  renderRelatedInput() {
    const { universes } = this.props;
    const { related, relatedInputValue } = this.state;
    const containerStyle = {
      display: 'flex',
      flexFlow: 'row wrap',
      justifyContent: 'start',
      border: '1px solid DarkGrey',
    };
    const relatedStyle = {
      background: '#eee',
      padding: 6,
      margin: 6,
    };
    const inputStyle = {
      border: 'none',
      outline: 'none',
    };
    const removeStyle = {
      background: '#ccc',
      color: '#fff',
      fontSize: '0.7em',
      marginLeft: 6,
      cursor: 'pointer',
      padding: '0 3px 0 3px',
    };
    
    const namesList = relatedInputValue ? Object.keys(this.inverseUniverses)
      .filter(key => key.toLowerCase().startsWith(relatedInputValue.toLowerCase()))
      .sort().slice(0, 9): [];
    
    return <div>
      <div style={containerStyle}>
        { related.map((id, i) => 
          <div style={relatedStyle} key={id}>
            { universes[id].name }
            <span style={removeStyle} onClick={this.removeRelated.bind(this, i)}>x</span>
          </div>
        )}
        <input 
          style={inputStyle}
          value={relatedInputValue} 
          onChange={this.handleInputRelated}
          onKeyDown={this.handleKeyDownRelated}
        />
      </div>
      { namesList.map((name, i) => <div key={i}>{ name }</div>) }
    </div>;
  }
  
  renderBackGroundImage() {
    const containerStyle = {
      display: 'flex',
      flexFlow: 'row wrap',
      justifyContent: 'space-between',
    };
    
    const imageStyle = {
      maxWidth: '100%',
      maxHeight: '100%',
    };
    
    const setItemStyle = url => ({
      maxWidth: '25%',
      maxHeight: '45%',
      overflow: 'hidden',
      border: url === this.state.picture ? '2px solid green' : 'none',
    });
    
    const images = pictures.map(({url, name, description}) =>
      <div style={setItemStyle(url)} onClick={this.handleSelectPicture.bind(this, url)} key={name}>
        <div>{ name }</div>
        <div>{ description }</div>
        <img src={url} style={imageStyle}/>
      </div>
    );
    
    return <div style={containerStyle}>
      { images }
    </div>;
  }
  
  render() {
    const divStyle = {
      width: '60%',
      margin: '20 auto 0 auto',
      fontSize: '2rem',
    };
    
    const { name, description } = this.state;
    
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
            { this.renderRelatedInput() }
            
          </div>
          
          <br />
          <div>
            <div>Background image</div>
            { this.renderBackGroundImage() }
          </div>
          
          <br />
          <input type="submit" value='Create universe' />
        </form>
        
      </div>
    );
  }
}

const mapState = state => ({
  universes: state.universes
});
const mapActions = dispatch => bindActionCreators({ createUniverse, readUniverses }, dispatch);

export default connect(mapState, mapActions)(CreateUniverse);
