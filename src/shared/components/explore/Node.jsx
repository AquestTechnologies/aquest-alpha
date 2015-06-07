import React from 'react';

class Node extends React.Component {
  
  constructor() {
    super();
    
    this.handleSelectUniverse = async (id, name) => {
      console.log('-c- Node.handleSelectUniverse ' + id);
      await this.props.loadUniverse(id);
      this.props.loadTopics(id);
      this.context.router.transitionTo('/_' + name);
    };
  }
  
  render() {
    let universe = this.props.universe;
    
    return (
      <div>
          <div onClick={ this.handleSelectUniverse.bind(null, universe.id, universe.name) }>
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