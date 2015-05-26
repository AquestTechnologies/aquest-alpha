import React from 'react';
import Router from 'react-router';
let RouteHandler = Router.RouteHandler;

class App extends React.Component {
  render() {
    return (
      <div>
        <RouteHandler />
      </div>
    );
  }
}

export default App;