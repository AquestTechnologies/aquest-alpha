import React    from 'react';
import Card     from './inventory/Card';
import CardNew  from './inventory/CardNew';

class Inventory extends React.Component {
  
  // Load les données initiales
  static runPhidippides(routerState) {
    return [{
      id:         'inventory',
      dependency: 'universe',
      creator:    'loadInventory',
      args:       ['__dependency.id']
    }];
  }
  
  
  constructor() {
    super();
    this.state = {
      nameVisible: true
    };
    this.handleHeaderHover = () => this.setState({ nameVisible: !this.state.nameVisible });
  }
  
  componentWillMount() {
    // console.log(this.props.topics);
    // if (!Object.keys(this.props.topics).length) this.props.loadInventory(this.props.universe.id);
    if (!this.props.universe.lastInventoryUpdate) this.props.loadInventory(this.props.universe.id);
    // // if(this.props.universe.id !== this.props.inventory.universeId) {
    // if(false) {
    //   this.props.loadInventory(this.props.universe.id);
    // } else {
    //   this.setState({inventory: this.props.topics});
    // }
  }
  
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.universe.id === nextProps.inventory.universeId) this.setState({ inventory: nextProps.inventory });
  //   // if (true) this.setState({ inventory: nextProps.inventory });
  // }
  
  
  
  render() {
    const universe = this.props.universe;
    const topics = this.props.topics;
    const inventoryListClassName = Object.keys(topics).length ? 'inventory_list_visible' : 'inventory_list_hidden';
    // const inventoryListClassName = this.props.universe.lastInventoryUpdate ? 'inventory_list_visible' : 'inventory_list_hidden';
    return (
      <div>      
        <div className="inventory_header">
          <div className={this.state.nameVisible ? 'inventory_header_name' : 'inventory_header_desc'} onMouseOver={this.handleHeaderHover} onMouseOut={this.handleHeaderHover}>
            {this.state.nameVisible ? universe.name : universe.description}
          </div>
        </div>
        
        <div className={inventoryListClassName} >
          <CardNew universeName={universe.id} />
          {Object.keys(topics).map(key => {
            return <Card
              key = {key} 
              topic = {topics[key]} // topic represente le contenu necessaire pour la card, pas le topic au complet (avec contenu)
            />;
          })}
        </div>
        
      </div>
    );
  }
  
}

export default Inventory;