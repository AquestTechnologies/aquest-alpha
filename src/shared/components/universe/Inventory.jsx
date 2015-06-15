import React from 'react';
import Chat from './Chat.jsx';
import Card from './Card.jsx';
import CardNew from './CardNew.jsx';

class Inventory extends React.Component {
  
  constructor() {
    super();
    this.state = {
      nameVisible: true
    };
    this.handleHeaderHover = () => this.setState({ nameVisible: !this.state.nameVisible });
  }
  
  // Load les données initiales
  static runPhidippides(routerState) {
    if (routerState.c === 1) {
      let correctDependency = routerState.params.topicHandle ? 'topic' : 'universe';
      return [{
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
      }, {
        taskName: 'chat',
        dependency: correctDependency,
        shouldBePresent: {
          store: 'chatStore',
          data: 'chat',
          shouldHaveValue: null
        },
        ifNot:  {
          actions: 'chatActions',
          creator: 'loadChat',
          args : ['__dependency.chatId']
        }
      }];
    } else {
      return;
    }
  }
  
  componentDidMount() {
    // Fetch des dépendances après le mount, cf. _?.txt
    let universeId = this.props.universe.id;
    if(universeId !== this.props.inventory.universeId) {
      this.props.actions.loadInventory(universeId);
    }
  }
  
  render() {
    let universe = this.props.universe;
    let topics = this.props.inventory ? this.props.inventory.topics : [];
    let inventoryListClassName = topics.length === 0 ? 'inventory_list_hidden' : 'inventory_list_visible';
    if (true) { inventoryListClassName += ' no_animation'; } //On verra plus tard pour d'eventuelles animations
    
    return (
      <div>
        <div className="universe_left">
          <div className="universe_left_scrollable">
            <div className="universe_left_scrolled">
            
              <div className="inventory_header">
                <div className={this.state.nameVisible ? 'inventory_header_name' : 'inventory_header_desc'} onMouseOver={this.handleHeaderHover} onMouseOut={this.handleHeaderHover}>
                    {this.state.nameVisible ? universe.name : universe.description}
                </div>
              </div>
              <div className={inventoryListClassName} >
                <CardNew />
                {topics.map( (topic) => {
                  // On peut surement passer tout ca avec un spreadattribute {...topic}
                  // Par contre topic represente le contenu necessaire pour la card, pas le topic au complet (avec contenu et votes detaillés)
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