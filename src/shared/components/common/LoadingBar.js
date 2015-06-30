import React from 'react';

export default class LoadingBar extends React.Component {
  
  constructor() {
    super();
    this.state = {
      loadings: []
    };
  }
  
  componentWillReceiveProps(nextProps) {
    let nextRecords = nextProps.records;
    let needsResolving = [];
    
    for (let record of nextRecords) {
      let type = record.action.type;
      let subType = type.substr(8); //pratique :)
      if (type.match(/REQUEST/)) {
        needsResolving.push(subType);
      }
      else if (type.match(/SUCCESS|FAILURE/)) {
        for (let needs of needsResolving) {
          if (needs === subType) {
           needsResolving.splice(needsResolving.indexOf(needs), 1);
          }
        }
      }
    }
    this.setState({
      loadings: needsResolving
    });
  }
  
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
      fontWeight: '700',
      color: '#FF6600'
    };
    
    return (
      <div style={divStyle}>
        {this.state.loadings.map(
          loading => <div key={loading}>{loading}</div> 
        )}
      </div>
    );
  }
}
