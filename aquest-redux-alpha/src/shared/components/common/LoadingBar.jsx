import React from 'react';

class LoadingBar extends React.Component {
  render() {
    
    // CSS temporaire
    let divStyle = {
      width: 'auto',
      height: 'auto',
      position: 'fixed',
      left: '4rem',
      // right: '0',
      top: '0',
      zIndex: '1000',
      // backgroundColor: '#fff',
      fontSize: '1.7rem',
      fontWeight: '700'
    };
    
    let nowYouSeeMe = {
      color: '#FF6600',
    };
    
    let nowYouDont = {
      display: 'none'
    };
    
    return (
      <div style={divStyle}>
          <div style={this.props.universeIsLoading  ? nowYouSeeMe : nowYouDont}>Universe  </div>
          <div style={this.props.universesIsLoading ? nowYouSeeMe : nowYouDont}>Universes </div>
          <div style={this.props.inventoryIsLoading ? nowYouSeeMe : nowYouDont}>Inventory </div>
          <div style={this.props.topicIsLoading     ? nowYouSeeMe : nowYouDont}>Topic     </div>
          <div style={this.props.chatIsLoading      ? nowYouSeeMe : nowYouDont}>Chat      </div>
      </div>
    );
  }
}

LoadingBar.defaultProps = {
  universeIsLoading: false,
  universesIsLoading: false,
  inventoryIsLoading: false,
  topicIsLoading: false,
  chatIsLoading: false
};

export default LoadingBar;        
