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
      fontSize: '1.5rem',
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
          <span style={this.props.universeIsLoading ? nowYouSeeMe : nowYouDont}> universeStore</span>
          <span style={this.props.topicIsLoading ? nowYouSeeMe : nowYouDont}> topicStore</span>
      </div>
    );
  }
}

export default LoadingBar;        
