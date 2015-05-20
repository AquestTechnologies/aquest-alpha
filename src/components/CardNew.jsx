import React from 'react';

class CardNew extends React.Component {
  render() {
    return (
      <div className="cardNew">
        <div className="card_content">
          <div className="card_title"><div>{this.props.title}</div><div>{this.props.title2}</div></div>
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

export default CardNew;
