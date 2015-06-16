import React from 'react';
import Chat from './Chat.jsx';
import Card from './Card.jsx';
import CardNew from './CardNew.jsx';

class Inventory extends React.Component {
  
  // Load les données initiales
  static runPhidippides(routerState) {
    if (routerState.c === 1) return [{
      taskName: 'inventory',
      dependency: 'universe',
      shouldBePresent: {
        store: 'topicStore',
        data: 'inventory',
        shouldHaveValue: null
      },
      ifNot:  {
        actions: 'topicActions',
        creator: 'loadInventory',
        args : ['__dependency.id']
      }
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
      this.props.actions.loadInventory(this.props.universe.id);
    } else {
      this.setState({ inventory: this.props.inventory });
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.universe.id === nextProps.inventory.universeId) this.setState({ inventory: this.props.inventory });
  }
  
  render() {
    let universe = this.props.universe;
    let inventory = this.state.inventory;
    let topics = inventory.topics || [];
    
    let inventoryListClassName = topics.length === 0 ? 'inventory_list_hidden' : 'inventory_list_visible';
    if (true) { inventoryListClassName += ' no_animation'; } //On verra plus tard pour d'eventuelles animations
    
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
              <CardNew universe={this.props.universe}/>
              {topics.map( (topic) => {
                // On peut surement passer tout ca avec un spreadattribute {...topic}
                // Par contre topic represente le contenu necessaire pour la card, pas le topic au complet (avec contenu et votes detaillés)
                return <Card key={topic.id} title={topic.title} author={topic.author} desc={topic.desc} imgPath={topic.imgPath} timestamp={topic.timestamp} />;
              })}
            </div>
            
          </div>
        </div>
      </div>
    );
  }
}

Inventory.defaultProps = {
  universe: {},
  inventory: {
    universeId: 111,
    topics: []
  }
};

export default Inventory;