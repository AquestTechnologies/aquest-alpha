import React from 'react';
import { Link } from 'react-router';

import Node from './explore/Node.jsx';
import generateGraph from '../utils/graphGenerator.js';
import {default as generatePseudos, getBiggestPseudo, getSmallestPseudo} from '../utils/pseudosGenerator.js';

export default class Explore extends React.Component {
  
  static runPhidippides(routerState) {
    return [{
      on:              ['server', 'client'],
      shouldBePresent: 'universe.universes',
      ifNot:           ['universeActions.loadUniverses', []]  
    }];
  }
  
  componentDidMount() {
    React.render(<Graph />, document.getElementById('graph'));
    React.render(<Pseudos />, document.getElementById('pseudos'));
  }
  
  render() {
    // CSS temporaire
    let divStyle = {
      width: '60%',
      margin: 'auto',
      fontSize: '2rem'
    };
    
    return (
      <div style={divStyle}>
        {this.renderBackLink()}
        {this.props.universes.map( (universe) => {
          return (
            <Node 
              key={universe.id} 
              universe={universe} 
              currentUniverse={this.props.currentUniverse} 
              setUniverse={this.props.setUniverse} 
              style={divStyle}
            />
          );
        })}
        <br />
        <br />
        <div id="graph" />
        <br />
        <br />
        <div id="pseudos" />
      </div>
    );
  }
  
  renderBackLink() {
    if(this.props.universe) {
      return <Link to='universe' params={{universeHandle: this.props.universe.handle}}>Back</Link>;
    } else {
      return <Link to='home'>Starting Universe</Link>;
    }
  }
  
}

class Graph extends React.Component {
  render() {
    let graph = generateGraph(10);
    return(
      <div>
        <h1>Node</h1>
        <div>{JSON.stringify(graph.nodes)}</div>
        <br/>
        <h1>Edges</h1>
        <div>{JSON.stringify(graph.edges)}</div>
      </div>
    );
  }
}

class Pseudos extends React.Component {
  
  constructor() {
    super();
    this.state={
      x: generatePseudos(6),
      pseudos: generatePseudos(50),
      big: '',
      small: ''
    };
    this.handleClick = () => this.setState({x: generatePseudos(6)});
    this.handleBig = () => this.setState({big: getBiggestPseudo()});
    this.handleSmall = () => this.setState({small: getSmallestPseudo()});
  }
  again() {
    console.log('!');
    this.setState({x: generatePseudos(6)});
  }
  
  render() {
    let x = this.state.x;
    return(
      <div>
        <h1>Choose one :</h1>
        <br/>
        <div>
          <span style = {{marginRight:50}}>{x[0]}</span>
          <span style = {{marginRight:50}}>{x[1]}</span>
          <span style = {{marginRight:50}}>{x[2]}</span>
        </div>
        <br/>
        <div>
          <span style = {{marginRight:50}}>{x[3]}</span>
          <span style = {{marginRight:50}}>{x[4]}</span>
          <span style = {{marginRight:50}}>{x[5]}</span>
        </div>
        <br/>
        <button onClick={this.handleClick}>New ones</button>
        <button onClick={this.handleBig}>Biggest ?</button>
        <button onClick={this.handleSmall}>Smallest ?</button>
        <br/>
        <br/>
        <span style={{marginRight:25}}>{this.state.big}</span>
        <span>{this.state.big.length == 0 ? '' : this.state.big.length + ' letters'}</span>
        <br/>
        <span style={{marginRight:25}}>{this.state.small}</span>
        <span>{this.state.small.length == 0 ? '' : this.state.small.length + ' letters'}</span>
        <br/>
        <h1>Pseudos</h1>
        {this.state.pseudos.map( pseudo => {
          return(<li>{pseudo}</li>);
        })}
      </div>
    );
  }
}