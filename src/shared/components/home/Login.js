import React from 'react';

class Login extends React.Component {
  
  constructor() {
    super();
    
    this.handleInputPseudoOrEmail = event => this.setState({pseudoOrEmail: event.target.value});
    this.handleInputPassword = event => this.setState({password: event.target.value});
    this.handleSubmit = () => this.props.authenticateUser(this.state);
    
    this.state = {
      pseudoOrEmail: '',
      password: '',
    };
  }
  
  render() {
    let divStyle = {
      width: '50%',
      fontSize: '2rem',
    };
    
    const {pseudoOrEmail, password} = this.state;
    
    return (
      <div style={divStyle} >
        <h2>Log in</h2>
        <div>
          <div>Pseudo or email</div>
          <input type="text" value={pseudoOrEmail} onChange={this.handleInputPseudoOrEmail} />
        </div>
        <br />
        <div>
          <div>Password</div>
          <input type="text" value={password} onChange={this.handleInputPassword} />
        </div>
        <br />
        <button type="button" onClick={this.handleSubmit}>Go!</button>
      </div>
    );
  }
}

export default Login;