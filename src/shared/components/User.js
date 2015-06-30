import React from 'react';
import { Link } from 'react-router';
import Icon from './common/Icon';

class User extends React.Component {
  /*
  static runPhidippides(routerState) {
    return [{
      on:              ['server', 'client'],
      shouldBePresent: 'user.id',
      ifNot:           ['userActions.loadUser', []] // Surement pas
    }];
  }
  */
  componentDidMount() {
    // React.render(<Graph />, document.getElementById('graph'));
  }
  
  render() {
    // CSS temporaire
    let _user_ = {
      width: '100%',
      fontSize: '2rem'
    };
    let _user_name = {
      marginTop: '5%',
      textAlign: 'center',
      width: '100%',
      fontSize: '5rem'
    };
    let _user_picture = {
      textAlign: 'center',
      margins: 'auto',
      height: '10rem',
      width: '1'
    };
    
    const user = this.props.user;
    
    return (
      <div style={_user_}>
        <div style={_user_name}>
          {user.name}
          <br/>
          <br/>
        <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/y1txYjoSQQc?rel=0&amp;showinfo=0" frameBorder="0" allowFullScreen></iframe>
        </div>
      </div>
    );
  }
}

User.defaultProps = {
  user: {
    name: 'Admin'
  }
};

export default User;

class Yo extends React.Component {
  render() {
    return(
      <div>
      </div>
    );
  }
}
