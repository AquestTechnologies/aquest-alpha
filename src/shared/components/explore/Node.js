import React from 'react';

class Node extends React.Component {
  
  handleSelectedUniverse(universeId) {
    console.log('-C- Node.handleSelectedUniverse ' + universeId);
    this.context.router.transitionTo('universe', {universeId});
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

// Node.defaultProps = {
// };

// Permet d'acceder a this.context.router
Node.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default Node;