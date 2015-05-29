import React from 'react';

class Item extends React.Component {
  
  render() {
    return (
      <div className="card">
          <div className="card_title">{this.props.title}</div>
          <div className="card_author">{"By " + this.props.author + ", " + this.props.timestamp + " ago."}</div>
          {this.setPreview()}
          {this.setFooter()}
      </div>
    );
  }
}

export default Item;