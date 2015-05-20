import React from 'react';

class Card extends React.Component {
  
  setPreview() {
    let imgPath = this.props.imgPath;
    let desc = this.props.desc;
    
    if (imgPath.length > 0) return <img src={imgPath} className="card_image" />;
    
    return (
        <div className="card_description">
          {desc}
        </div>
    );
  }
  
  setFooter() {
    let imgPath = this.props.imgPath;
    if (imgPath.length == 0) return <div className="card_description_footer"></div>;
    // Pas de return c'est grave?
  }
    
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

Card.defaultProps = {
    title: "Lorem ipsum dolor sit amet, consectetur adipisc ing elit, sed do eiusmod tempor incididunt ut lab",
    author: "Cicero",
    desc: "Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I'm in a transitional period so I don't wanna kill you, I wanna help you. But I can't give you this case, it don't belong to me. Besides, I've already been through too much shit this morning over this case to hand it over to your dumb ass. Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.",
    imgPath: "",
    timestamp:"a long time"
};

export default Card;