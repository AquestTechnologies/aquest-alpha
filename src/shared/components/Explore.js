import React from 'react';
import Node  from './explore/Node';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { readUniverses } from '../actionCreators';

class Explore extends React.Component {
  
  static runPhidippides(routerState) {
    return [{
      id:      'universes',
      creator: 'readUniverses',
      args:    []
    }];
  }
  
  componentDidMount() {
    const { universes, readUniverses } = this.props;
    if (universes.size < 2) readUniverses();
  }
  
  render() {
    const divStyle = {
      width: '60%',
      margin: '0 auto 0 auto',
      fontSize: '2rem',
    };
    
    return <div style={divStyle}>
      <Link to='/'>Home</Link>
      {' - '}
      <Link to='/Create_universe'>Create a new universe</Link>
      <br/>
      <br/>
      { this.props.universes.sort().map(universe => <Node key={universe.get('id')} universe={universe} />) }
    </div>;
  }
}

const mapState = state => ({
  universes: state.universes
});

const mapActions = dispatch => bindActionCreators({ readUniverses }, dispatch);

export default connect(mapState, mapActions)(Explore);
