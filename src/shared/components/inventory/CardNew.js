import React from 'react';

class CardNew extends React.Component {
  
  constructor() {
    super();
    this.handleClick = () => { 
      this.context.router.transitionTo('newTopic', {universeId: this.props.universeId});
    };
  }
  
  render() {
    return (
      <div className="cardNew" onClick={this.handleClick}>
        <div className="card_content">
          <div className="cardNew_title">
            <div>{this.props.title}</div>
            <div>{this.props.title2}</div>
          </div>
          <div className="cardNew_author">{this.props.author}</div>
          <div className="cardNew_description">
            {this.props.desc}
          </div>
        </div>
      </div>
    );
  }
}

CardNew.defaultProps = {
    title: "Tell them what you love,",
    title2: "Ask for the impossible.",
    author: "By you, in a minute.",
    desc: "Start a revolution, or a new topic, or both!",
    imgPath: "",
    timestamp:"timestamp"
};

// Permet d'acceder a this.context.router
CardNew.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default CardNew;
