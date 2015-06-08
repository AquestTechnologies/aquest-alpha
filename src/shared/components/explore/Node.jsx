import React from 'react';

class Node extends React.Component {
  
  constructor() {
    super();
    
    this.handleSelectUniverse = async (universe) => {
      console.log('-c- Node.handleSelectUniverse ' + universe);
      await this.props.actions.loadUniverse(universe.id);
      // this.props.setUniverse(universe);
      this.props.actions.flushTopics();
      this.props.actions.flushChat();
      this.context.router.transitionTo('/_' + universe.name);
      this.props.actions.loadTopics(universe.id);
      this.props.actions.loadChat(universe.chatId);
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