import React from 'react';

class Node extends React.Component {
  
  constructor() {
    super();
    
    this.handleSelectUniverse = (universe) => {
      console.log('-c- Node.handleSelectUniverse ' + universe.name);
      this.props.setUniverse(universe);
      this.context.router.transitionTo('universe', {universeName: universe.name});
    };
  }
  
  render() {
    let universe = this.props.universe;
    
    return (
      <div>
          <div onClick={ this.handleSelectUniverse.bind(null, universe) }>
            { universe.name }
          </div>
          { universe.description }
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