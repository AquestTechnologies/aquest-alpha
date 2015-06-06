import React from 'react';

class Node extends React.Component {
  
  constructor() {
    super();
    
    this.handleSelectUniverse = (id) => {
      console.log('___ Node.handleSelectUniverse ' + id);
      this.props.loadUniverse(id);
      this.context.router.transitionTo('/');
    };
  }
  
  render() {
    let universe = this.props.universe;
    
    return (
      <div>
          <div onClick={this.handleSelectUniverse.bind(null, universe.id)}>
            {universe.name}
          </div>
          {universe.description}
      </div>
    );
  }
}

Node.defaultProps = {
};

Node.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default Node;