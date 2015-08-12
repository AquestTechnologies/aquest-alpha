import React from 'react';
import Home from './app/Home';
import LoadingBar from './app/LoadingBar';

export default class App extends React.Component {
  
  render() {
    const { children } = this.props;
    
    return (
      <div> 
        <LoadingBar />
        { children ? children : <Home /> }
      </div>
    );
  }
}
