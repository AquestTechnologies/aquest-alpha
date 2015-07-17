import React from 'react';
import {generateOnePseudo} from '../../utils/pseudosGenerator';
import {randomString} from '../../utils/randomGenerator';

class Signup extends React.Component {
  
  constructor() {
    super();
    
    this.handleInputPseudo = event => this.setState({pseudo: event.target.value});
    this.handleInputEmail = event => this.setState({email: event.target.value});
    this.handleInputPassword = event => this.setState({password: event.target.value});
    this.handleSubmit = () => this.props.createUser(this.state);
    
    this.state = {
      pseudo: '',
      email: '',
      password: '',
    };
  }
  
  componentDidMount() {
    this.setState({
      pseudo: generateOnePseudo(),
      email: (randomString(3) + '@' + randomString(3) + '.' + randomString(3)).toLowerCase(),
      password: randomString(10),
      redirect: this.context.router.transitionTo.bind(null, 'explore')
    });
  }
  
  render() {
    let divStyle = {
      width: '50%',
      fontSize: '2rem',
    };
    
    const {pseudo, password, email} = this.state;
    
    return (
      <div style={divStyle} >
        <h2>Sign up</h2>
        <div>
          <div>Pseudo (unique)</div>
          <input type="text" value={pseudo} onChange={this.handleInputPseudo} />
        </div>
        <br />
        <div>
          <div>Email (unique)</div>
          <input type="text" value={email} onChange={this.handleInputEmail} />
        </div>
        <br />
        <div>
          <div>Password</div>
          <input type="text" value={password} onChange={this.handleInputPassword} />
        </div>
        <br />
        <button type="button" onClick={this.handleSubmit}>Start adventure!</button>
      </div>
    );
  }
}

Signup.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default Signup;