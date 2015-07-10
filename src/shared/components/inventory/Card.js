import React from 'react';

class Card extends React.Component {
  
  setPreview() {
    if (this.props.topic.picture.length) return <img src={this.props.topic.picture} className="card_image" />;
    return <div className="card_description">{this.props.topic.description}</div>;
  }
  
  setFooter() {
    if (!this.props.topic.picture.length) return <div className="card_description_footer"></div>;
  }
  
  handleClick(topic) { 
    console.log(`-C- Card.handleClick ${topic.id}`);
    this.context.router.transitionTo('topic', {
      universeId: this.context.router.getCurrentParams().universeId, 
      topicId: topic.id
    });
  };
    
  render() {
    const topic = this.props.topic;
    return (
      <div className="card" onClick={this.handleClick.bind(this, topic)}>
        <div className="card_title">{topic.title}</div>
        <div className="card_author">{`By ${topic.author}, ${topic.timestamp} ago.`}</div>
        {this.setPreview()}
        {this.setFooter()}
      </div>
    );
  }
}

//à suppr? 
Card.defaultProps = {
  topic: {
    id: 'defaultTopicId',
    title: "Default ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
    author: "Cicero",
    desc: "Default, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
    picture: "",
    timestamp:"a long time",
  },
  universeName: 'Default',
  setTopic: function() {console.log('default setTopic')}
};

// Permet d'acceder a this.context.router
Card.contextTypes = {
  router: React.PropTypes.func.isRequired
};


export default Card;