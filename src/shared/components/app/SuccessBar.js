import React from 'react';

// This component is horrible and WILL be modified
export default class SuccessBar extends React.Component {
  
  constructor() {
    super();
    this.state = { 
      lastSuccess: '',
      visible: false,
    };
  }
  
  componentWillReceiveProps({ lastSuccess }) {
    if (lastSuccess) this.setState(
      { 
        lastSuccess,
        visible: true 
      },
      () => setTimeout(() => this.setState({ visible: false }), 3500)
    );
  }
  
  render() {
    const divStyle = {
      width: '100%',
      height: 'auto',
      position: 'fixed',
      left: '0',
      top: '0',
      zIndex: '999',
      fontSize: '1.7rem',
      fontWeight: '700',
      color: '#2FD359', // YOLO
      textAlign: 'center',
      padding: '1rem 0 1rem 0',
      backgroundColor: '#fff',
      visibility: this.state.visible ? 'visible' : 'hidden',
    };
    
    return <div style={divStyle}>{ this.state.lastSuccess }</div>;
  }
}
