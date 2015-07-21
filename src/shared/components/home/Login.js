import React from 'react';

class Login extends React.Component {
  
  constructor() {
    super();
    
    this.handleInputEmail = event => this.setState({email: event.target.value});
    this.handleInputPassword = event => this.setState({password: event.target.value});
    this.handleSubmit = () => this.props.login(this.state);
    
    this.state = {
      email: 'admin',
      password: 'admin',
    };
  }
  
  render() {
    let divStyle = {
      width: '50%',
      fontSize: '2rem',
    };
    
    const {email, password} = this.state;
    
    return (
      <div style={divStyle} >
        <h2>Log in</h2>
        <div>
          <div>Pseudo or email</div>
          <input type="text" value={email} onChange={this.handleInputEmail} />
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