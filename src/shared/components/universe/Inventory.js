import React from 'react';
import Card  from './Card';
import NewTopicCard from './NewTopicCard';

export default class Inventory extends React.Component {
  
  constructor() {
    super();
    
    this.state = { nameVisible: true };
    this.handleHeaderHover = () => this.setState({nameVisible: !this.state.nameVisible});
  }
  
  componentWillMount() {
    const { universe, readInventory } = this.props;
    if (!universe.lastInventoryUpdate) readInventory(universe.id);
  }
  
  render() {
    const { nameVisible } = this.state;
    const { universe: { name, description, id }, topics, transitionTo } = this.props;
    
    return (
      <div>
      
        <div className='inventory_header'>
          <div className='inventory_header_content' onMouseOver={this.handleHeaderHover} onMouseOut={this.handleHeaderHover}>
            <div className={nameVisible ? 'inventory_header_content_name' : 'inventory_header_content_desc'}>
              { nameVisible ? name : description }
            </div>
          </div>
        </div>  
        
        <div className='inventory_list'>
          
          <NewTopicCard 
            universeId={id} 
            transitionTo={transitionTo}
          />
          
          { 
            Object.keys(topics).map(key => 
              <Card
                key = {key} 
                transitionTo={transitionTo}
                topic = {topics[key]}
              />)
          }
          
        </div>
        
      </div>
    );
  }
  
}
