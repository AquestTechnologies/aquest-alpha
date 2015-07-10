import React from 'react';

class Node extends React.Component {
  
  constructor() {
    super();
    
    this.handleSelectUniverse = universeId => {
      console.log('-C- Node.handleSelectUniverse ' + universeId);
      this.context.router.transitionTo('universe', {universeId});
    };
  }
  
  render() {
    const universe = this.props.universe;
    
      // <div onClick={this.handleSelectUniverse.bind(null, universe.id)}>
    return (
      <div onClick={this.handleSelectUniverse(universe.get('id'))}>
          <div>
            {universe.get('name')}
          </div>
          <div>
            {universe.get('description')}
          </div>
      </div>
    );
  }
}

Node.defaultProps = {
};

// Permet d'acceder a this.context.router
Node.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default Node;