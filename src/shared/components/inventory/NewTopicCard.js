import React from 'react';

class NewTopicCard extends React.Component {
  
  handleClick() { 
    this.context.router.transitionTo('newTopic', {universeId: this.props.universeId});
  };
  
  render() {
    const {title, title2, author, description} = this.props;
    
    return (
      <div className="newTopicCard" onClick={this.handleClick.bind(this)}>
      
        <div className="card_content">
          <div className="newTopicCard_title">
            <div>{title}</div>
            <div>{title2}</div>
          </div>
          <div className="newTopicCard_author">
            {author}
          </div>
          <div className="newTopicCard_description">
            {description}
          </div>
        </div>
        
      </div>
    );
  }
}

NewTopicCard.defaultProps = {
    title: "Tell them what you love,",
    title2: "Ask for the impossible.",
    author: "By you, in a minute.",
    description: "Start a revolution, or a new topic, or both!",
    timestamp:"timestamp"
};

// Permet d'acceder a this.context.router
NewTopicCard.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default NewTopicCard;
