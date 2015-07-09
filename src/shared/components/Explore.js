import React from 'react';
import { Link } from 'react-router';

import Node from './explore/Node';
import generateGraph from '../utils/graphGenerator';
import {default as generatePseudos, getBiggestPseudo, getSmallestPseudo, getPossibilitiesNumber} from '../utils/pseudosGenerator';

import {loadUniverses} from '../actionCreators';

export default class Explore extends React.Component {
  
  static runPhidippides(routerState) {
    return [{
      id:      'universes',
      creator: 'loadUniverses',
      args:    []
    }];
  }
  
  componentDidMount() {
    React.render(<Graph />, document.getElementById('graph')); //Ne de-mount pa :(
    React.render(<Pseudos />, document.getElementById('pseudos'));
    this.props.loadUniverses();
  }
  
  render() {
    // CSS temporaire
    const divStyle = {
      width: '60%',
      margin: 'auto',
      fontSize: '2rem'
    };
    
    return (
      <div style={divStyle}>
        {this.renderBackLink()}
        {this.renderGraph()}
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
    let universe = this.props.universes[this.props.globals.universeId];
    if(universe) {
      return <Link to='universe' params={{universeHandle: universe.handle}}>Back</Link>;
    } else {
      return <Link to='home'>Starting Universe</Link>;
    }
  }
  
  // :(
  renderGraph() {
    const universesProps = this.props.universes;
    let universes = [];
    for (let key in universesProps) {
      if (universesProps.hasOwnProperty(key)) universes.push(universesProps[key]);
    }
    return universes.map(universe => {
      return(
        <Node 
          key={universe.id} 
          universe={universe} 
          currentUniverse={this.props.universes[this.props.globals.universeId]} 
          setUniverse={this.props.setUniverse} 
        />
      );
    });
  }
  
}

class Graph extends React.Component {
  render() {
    let graph = generateGraph(3);
    return(
      <div>
        <h1>Graph</h1>
        <h3>Nodes</h3>
        <div>{JSON.stringify(graph.nodes)}</div>
        <br/>
        <h3>Edges</h3>
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
      small: '',
      pos: ''
    };
    this.handleClick = () => this.setState({x: generatePseudos(6)});
    this.handleBig = () => this.setState({big: getBiggestPseudo()});
    this.handleSmall = () => this.setState({small: getSmallestPseudo()});
    this.handlePos = () => this.setState({pos: getPossibilitiesNumber()});
  }
  again() {
    console.log('!');
    this.setState({x: generatePseudos(6)});
  }
  
  render() {
    let x = this.state.x;
    return(
      <div>
        <h1>Pseudos</h1>
        <button onClick={this.handleClick}>New ones</button>
        <button onClick={this.handleBig} hidden={this.state.big.length > 0 ? true : false}>Biggest ?</button>
        <button onClick={this.handleSmall} hidden={this.state.small.length > 0 ? true : false}>Smallest ?</button>
        <button onClick={this.handlePos} hidden={this.state.pos.length > 0 ? true : false}>Nb of possibilities ?</button>
        <br/>
        <div>
          <span style={{marginRight:25}}>{this.state.big}</span>
          <span>{this.state.big.length == 0 ? '' : this.state.big.length + ' letters'}</span>
          <br/>
          <span style={{marginRight:25}}>{this.state.small}</span>
          <span>{this.state.small.length == 0 ? '' : this.state.small.length + ' letters'}</span>
          <br/>
          <span>{this.state.pos.length === 0 ? '' : this.state.pos}</span>
        </div>
        <br/>
        <h3>Choose one</h3>
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
        <h3>Or many</h3>
        {this.state.pseudos.map( pseudo => {
          return(<li key={pseudo}>{pseudo}</li>);
        })}
      </div>
    );
  }
}