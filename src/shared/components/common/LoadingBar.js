import React from 'react';

export default class LoadingBar extends React.Component {
  
  constructor() {
    super();
    this.state = {loadings: []};
  }
  
  componentWillReceiveProps(nextProps) {
    let needsResolving = [];
    const nextRecords = nextProps.records;
    
    nextRecords.forEach(record => {
      const type = record.action.type;
      const intention = type.substr(8); //pratique :)
      if (type.match(/REQUEST/)) needsResolving.push(intention);
      else if (type.match(/SUCCESS|FAILURE/)) needsResolving.forEach((awaiting, i) => {
        if (awaiting === intention) needsResolving.splice(i, 1);
      });
    });
    
    this.setState({loadings: needsResolving});
  }
  
  render() {
    const divStyle = {
      width: 'auto',
      height: 'auto',
      position: 'fixed',
      left: '4rem',
      top: '0',
      zIndex: '1000',
      fontSize: '1.7rem',
      fontWeight: '700',
      color: '#FF6600'
    };
    
    return (
      <div style={divStyle}>
        {this.state.loadings.map(loading => <div key={loading}>{loading}</div>)}
      </div>
    );
  }
}
