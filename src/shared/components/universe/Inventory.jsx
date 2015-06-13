import React from 'react';
import Chat from './Chat.jsx';
import Card from './Card.jsx';
import CardNew from './CardNew.jsx';

class Inventory extends React.Component {
  
  constructor() {
    super();
    this.state = {
      univNameVisible: true
    };
    this.handleHeaderHover = () => this.setState({ univNameVisible: !this.state.univNameVisible });
  }
  
  componentDidMount() {
    let universeId = this.props.universe.id;
    if(universeId !== this.props.inventory.universeId) {
      this.props.actions.loadInventory(universeId);
    }
  }
  
  render() {
    let universe = this.props.universe;
    let topics = this.props.inventory ? this.props.inventory.topics : [];
    let inventoryListClassName = topics.length === 0 ? 'inventory_list_hidden' : 'inventory_list_visible';
    if (true) { inventoryListClassName += ' no_animation'; }
    
    return (
      <div>
        <div className="inventory">
          <div className="inventory_scrollable">
            <div className="inventory_scrolled">
            
              <div className="inventory_header">
                <div className={this.state.univNameVisible ? 'inventory_header_name' : 'inventory_header_desc'} onMouseOver={this.handleHeaderHover} onMouseOut={this.handleHeaderHover}>
                    {this.state.univNameVisible ? universe.name : universe.description}
                </div>
              </div>
              <div className={inventoryListClassName} >
                <CardNew />
                {topics.map( (topic) => {
                    return <Card key={topic.id} title={topic.title} author={topic.author} desc={topic.desc} imgPath={topic.imgPath} timestamp={topic.timestamp} />;
                })}
              </div>
              
            </div>
          </div>
        </div>
        <Chat chatId={this.props.universe.chatId} chat={this.props.chat} actions={this.props.actions} />
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