import React from 'react';
import Card from './Card.jsx';
import CardNew from './CardNew.jsx';

class Inventory extends React.Component {
  constructor() {
    super();
    this.state = {univNameVisible: true};
    this.handleHeaderHover = () => this.setState({ univNameVisible: !this.state.univNameVisible });
  }
  
  render() {
    let universe = this.props.universe;
    let inventoryList = this.props.topics.length === 0 ? 'inventory_list_hidden' : 'inventory_list_visible';
    if ( this.props.c === 0 ) { inventoryList += ' no_animation'; }
    return (
      
      <div className="inventory">
        <div className="inventory_scrollable">
          <div className="inventory_scrolled">
          
            <div className="inventory_header">
              <div className={this.state.univNameVisible ? 'inventory_header_name' : 'inventory_header_desc'} onMouseOver={this.handleHeaderHover} onMouseOut={this.handleHeaderHover}>
                  {this.state.univNameVisible ? universe.name : universe.description}
              </div>
            </div>
            <div className={inventoryList} >
              <CardNew />
              {
                this.props.topics.map( (topic) => {
                  return <Card key={topic.id} title={topic.title} author={topic.author} desc={topic.desc} imgPath={topic.imgPath} timestamp={topic.timestamp} />;
                })
              }
            </div>
            
          </div>
        </div>
      </div>
    );
  }
}

Inventory.defaultProps = {/*
    univName: "STARTUPS",
    univDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris non nisi ex. Pellentesque at semper metus, sit amet dignissim dui. Proin semper malesuada mauris porttitor laoreet. Ut malesuada libero massa, in dapibus lorem ullamcorper eu. Vestibulum vel convallis lorem.",
*/};

export default Inventory;