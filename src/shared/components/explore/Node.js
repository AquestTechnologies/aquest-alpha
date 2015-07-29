import React from 'react';

export default class Node extends React.Component {
  
  handleSelectedUniverse(universeId) {
    console.log('-C- Node.handleSelectedUniverse ' + universeId);
    this.props.transitionTo('_' + universeId);
  };  
  
  render() {
    const {universe} = this.props;
    
    return (
      <div onClick={this.handleSelectedUniverse.bind(this, universe.id)} style={{marginTop: 10}}>
          <div>
            {universe.name}
          </div>
          <div>
            {universe.description}
          </div>
      </div>
    );
  }
}
