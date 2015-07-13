import React    from 'react';
import Card     from './inventory/Card';
import NewTopicCard  from './inventory/NewTopicCard';

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
    this.handleHeaderHover = () => this.setState({nameVisible: !this.state.nameVisible});
  }
  
  componentWillMount() {
    // console.log(this.props.topics);
    // console.log(this.props.universe);
    if (!this.props.universe.lastInventoryUpdate) this.props.loadInventory(this.props.universe.id);
  }
  
  render() {
    const {nameVisible} = this.state;
    const {universe, topics} = this.props;
    const keys = Object.keys(topics);
    
    return (
      <div>      
        <div className='inventory_header'>
          <div className='inventory_header_content' onMouseOver={this.handleHeaderHover} onMouseOut={this.handleHeaderHover}>
            <div className={nameVisible ? 'inventory_header_content_name' : 'inventory_header_content_desc'}>
              {nameVisible ? universe.name : universe.description}
            </div>
          </div>
        </div>
        
        <div className={keys.length ? 'inventory_list-visible' : 'inventory_list-hidden'} >
          <NewTopicCard universeId={universe.id} />
          {keys.map(key => {
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