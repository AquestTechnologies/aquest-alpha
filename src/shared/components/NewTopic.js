import React from 'react';
import {Link} from 'react-router';

class NewTopic extends React.Component {
  
  render() {
    const divStyle = {
      backgroundColor: '#fff',
      marginTop: 80,
      fontSize: '2rem',
    };
    
    return (
      <div style={divStyle}>
      
        <Link to='universe' params={{universeId: this.props.params.universeId}}>Back</Link>
        
        <div className="topicNew_header">
          New topic in {this.props.universe.name}
        </div>
        
        <div className="topicNew_rules">
          yo, please don't be evil
        </div>
        
        <div className="topicNew">
         sup?
        </div>
    </div>
    );
  }
}

export default NewTopic;