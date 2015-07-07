import React    from 'react';
import Card     from './Card';
import CardNew  from './CardNew';

class Inventory extends React.Component {
  
  // Load les données initiales
  /*static runPhidippides(routerState) {
    return [{
      on:              ['server'],
      shouldBePresent: 'topic.inventory',
      dependency:      'universe.universe',
      ifNot:           ['topicActions.loadInventory', ['__dependency.id']]  
    }];
  }*/
  
  constructor() {
    super();
    this.state = {
      inventory: {},
      nameVisible: true
    };
    this.handleHeaderHover = () => this.setState({ nameVisible: !this.state.nameVisible });
  }
  
  componentWillMount() {
    // if(this.props.universe.id !== this.props.inventory.universeId) {
    if(false) {
      this.props.loadInventory(this.props.universe.id);
    } else {
      this.setState({inventory: this.getInventory()});
    }
  }
  
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.universe.id === nextProps.inventory.universeId) this.setState({ inventory: nextProps.inventory });
  //   // if (true) this.setState({ inventory: nextProps.inventory });
  // }
  
  getInventory() {
    // console.log('.c. Inventory getInventory');
    const topics = this.props.topics;
    const universeId = this.props.universe.id;
    // console.log(universeId);
    let inventory = [];
    for (let key in topics) {
      // console.log(topics[key].universeId);
      if (topics.hasOwnProperty(key) && topics[key].hasOwnProperty('universeId') && topics[key].universeId === universeId) {
        inventory.push(topics[key]);
      }
    }
    // console.log(inventory.length);
    return inventory;
  }
  
  render() {
    const universe  = this.props.universe;
    const inventoryListClassName = this.state.inventory.length === 0 ? 'inventory_list_hidden' : 'inventory_list_visible';
    
    return (
      <div>      
        <div className="inventory_header">
          {this.renderHeader(universe)}
        </div>
        
        <div className={inventoryListClassName} >
          <CardNew universeName={universe.name} />
          {this.renderCards(this.state.inventory)}
        </div>
        
      </div>
    );
  }
  
  renderHeader(universe) {
    return(
      <div className={this.state.nameVisible ? 'inventory_header_name' : 'inventory_header_desc'} onMouseOver={this.handleHeaderHover} onMouseOut={this.handleHeaderHover}>
        {this.state.nameVisible ? universe.name : universe.description}
      </div>
    );
  }
  
  renderCards() {
    return (
      this.state.inventory.map(topic => {
        return <Card 
          key={topic.id} 
          universeHandle={this.props.universe.handle}
          topic={topic} // topic represente le contenu necessaire pour la card, pas le topic au complet (avec contenu)
          setTopic={this.props.setTopic}
        />;
      })
    );
  }
  
}

export default Inventory;