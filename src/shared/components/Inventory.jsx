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
    let currentUniverse = this.props.currentUniverse;
    return (
      
      <div className="inventory">
        <div className="inventory_scrollable">
          <div className="inventory_scrolled">
          
            <div className="inventory_header">
              <div className={this.state.univNameVisible ? "inventory_header_name" : "inventory_header_desc"} onMouseOver={this.handleHeaderHover} onMouseOut={this.handleHeaderHover}>
                  {this.state.univNameVisible ? currentUniverse.name : currentUniverse.description}
              </div>
            </div>
            
            <div className="inventory_list">
              <CardNew />
              <Card imgPath="img/image1.png"/>
              <Card />
              <Card />
              <Card imgPath="img/image2.png"/>
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
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