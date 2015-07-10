import React from 'react';

class Node extends React.Component {
  
  constructor() {
    super();
    
    this.handleSelectUniverse = universe => {
      console.log('-c- Node.handleSelectUniverse ' + universe.handle);
      this.props.setUniverse(universe);
      this.context.router.transitionTo('universe', {universeHandle: universe.handle});
    };
  }
  
  render() {
    const universe = this.props.universe;
    
    return (
      <div onClick={this.handleSelectUniverse.bind(null, universe)}>
          <div >
            {universe.name}
          </div>
          <div >
            {universe.description}
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