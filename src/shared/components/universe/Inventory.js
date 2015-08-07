import React    from 'react';
import Card     from './Card';
import NewTopicCard  from './NewTopicCard';

class Inventory extends React.Component {
  
  constructor() {
    super();
    
    this.state = { nameVisible: true };
    this.handleHeaderHover = () => this.setState({nameVisible: !this.state.nameVisible});
    this.renderCards = (topics, transitionTo) => Object.keys(topics).map(key => <Card
      key = {key} 
      transitionTo={transitionTo}
      topic = {topics[key]}
    />);
  }
  
  componentWillMount() {
    const {universe, readInventory} = this.props;
    if (!universe.lastInventoryUpdate) readInventory(universe.id);
  }
  
  render() {
    const {nameVisible} = this.state;
    const {universe, topics, transitionTo} = this.props;
    
    return (
      <div>
      
        <div className='inventory_header'>
          <div className='inventory_header_content' onMouseOver={this.handleHeaderHover} onMouseOut={this.handleHeaderHover}>
            <div className={nameVisible ? 'inventory_header_content_name' : 'inventory_header_content_desc'}>
              { nameVisible ? universe.name : universe.description }
            </div>
          </div>
        </div>  
        
        <div className='inventory_list'>
          
          <NewTopicCard 
            universeId={universe.id} 
            transitionTo={transitionTo}
          />
          
          { this.renderCards(topics, transitionTo) }
          
        </div>
        
      </div>
    );
  }
  
}

export default Inventory;