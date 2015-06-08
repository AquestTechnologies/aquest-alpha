import React            from 'react';

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
          <div style={this.props.universeIsLoading ? nowYouSeeMe : nowYouDont}> universeStore</div>
          <div style={this.props.topicIsLoading ? nowYouSeeMe : nowYouDont}> topicStore</div>
          <div style={this.props.chatIsLoading ? nowYouSeeMe : nowYouDont}> chatStore</div>
      </div>
    );
  }
}

export default LoadingBar;        
