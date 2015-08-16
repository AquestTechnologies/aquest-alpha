import React from 'react';
import Card  from './Card';
import CreateTopicCard from './CreateTopicCard';

export default class Inventory extends React.Component {
  
  constructor() {
    super();
    
    this.state = { nameVisible: true };
    this.handleHeaderHover = () => this.setState({nameVisible: !this.state.nameVisible});
  }
  
  componentWillMount() {
    const { universe, readInventory } = this.props;
    if (!universe.has('lastInventoryUpdate')) readInventory(universe.get('id'));
  }
  
  render() {
    const { nameVisible } = this.state;
    const { universe, topics, transitionTo } = this.props;
    
    return (
      <div>
      
        <div className='inventory_header'>
          <div className='inventory_header_content' onMouseOver={this.handleHeaderHover} onMouseOut={this.handleHeaderHover}>
            <div className={nameVisible ? 'inventory_header_content_name' : 'inventory_header_content_desc'}>
              { nameVisible ? universe.get('name') : universe.get('description') }
            </div>
          </div>
        </div>  
        
        <div className='inventory_list'>
          
          <CreateTopicCard 
            universeId={universe.get('id')} 
            transitionTo={transitionTo}
          />
          
          { 
            topics.map(topic => 
              <Card
                topic = {topic}
                key = {topic.get('id')} 
                transitionTo={transitionTo}
              />)
          }
          
        </div>
        
      </div>
    );
  }
  
}
