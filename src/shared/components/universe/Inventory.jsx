import React from 'react';
import Card from './Card.jsx';
import CardNew from './CardNew.jsx';

class Inventory extends React.Component {
  
  constructor() {
    super();
    this.state = {
      univNameVisible: true,
      topicsAreLoading: false
    };
    this.handleHeaderHover = () => this.setState({ univNameVisible: !this.state.univNameVisible });
  }
  
  componentDidMount() {
    this.props.actions.loadTopics(this.props.universe.id);
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({
      topicsAreLoading: nextProps.topics.length === 0 ? true : false
    });
  }
  
  render() {
    let universe = this.props.universe;
    let inventoryListClassName = this.props.topics.length === 0 ? 'inventory_list_hidden' : 'inventory_list_visible';
    if (!this.state.topicsAreLoading) { inventoryListClassName += ' no_animation'; }
    
    return (
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
              {this.props.topics.map( (topic) => {
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
  topics: []
};

export default Inventory;