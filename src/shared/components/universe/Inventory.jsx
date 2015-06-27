import React    from 'react';
import Card     from './Card.jsx';
import CardNew  from './CardNew.jsx';

class Inventory extends React.Component {
  
  // Load les données initiales
  static runPhidippides(routerState) {
    return [{
      on:              ['server'],
      shouldBePresent: 'topic.inventory',
      dependency:      'universe.universe',
      ifNot:           ['topicActions.loadInventory', ['__dependency.id']]  
    }];
  }
  
  constructor() {
    super();
    this.state = {
      inventory: {},
      nameVisible: true
    };
    this.handleHeaderHover = () => this.setState({ nameVisible: !this.state.nameVisible });
  }
  
  componentWillMount() {
    if(this.props.universe.id !== this.props.inventory.universeId) {
      this.props.loadInventory(this.props.universe.id);
    } else {
      this.setState({ inventory: this.props.inventory });
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.universe.id === nextProps.inventory.universeId) this.setState({ inventory: nextProps.inventory });
  }
  
  render() {
    let universe  = this.props.universe;
    let inventory = this.state.inventory;
    let topics    = inventory.topics || [];
    
    let inventoryListClassName = topics.length === 0 ? 'inventory_list_hidden' : 'inventory_list_visible';
    
    return (
      <div className="universe_left" style={{backgroundImage: 'url(' + universe.picturePath + ')'}}>
        <div className="universe_left_scrollable">
          <div className="universe_left_scrolled">
          
            <div className="inventory_header">
              <div className={this.state.nameVisible ? 'inventory_header_name' : 'inventory_header_desc'} onMouseOver={this.handleHeaderHover} onMouseOut={this.handleHeaderHover}>
                  {this.state.nameVisible ? universe.name : universe.description}
              </div>
            </div>
            
            <div className={inventoryListClassName} >
              <CardNew universeName={this.props.universe.name}/>
              {topics.map( (topic) => {
                return <Card 
                  key={topic.id} 
                  universeHandle={this.props.universe.handle}
                  topic={topic} // topic represente le contenu necessaire pour la card, pas le topic au complet (avec contenu)
                  setTopic={this.props.setTopic}
                />;
              })}
            </div>
            
          </div>
        </div>
      </div>
    );
  }
}

export default Inventory;