import React from 'react';
import Login from '../Login';
import Signup from './Signup';
import { Link } from 'react-router';

export default class Home extends React.Component {
  
  renderLogin() {
    const { userId, logout, createUser } = this.props;
    const s2 = {
      marginTop: '20',
    };
    const s3 = { 
      display : 'flex', 
      alignContent: 'space-between',
    };
    
    return userId ?
      <div style={s2}>
        <button onClick={logout}>Logout</button>
      </div> 
      :
      <div style={s3}>
        <Login />
        <Signup createUser={createUser}/>
      </div>;
  }
  
  uploadImage() {
    
    const params = {
      file: document.getElementById('inputFile').files[0],
    };
    const progress = e => {
      if (e.lengthComputable) {
        console.log('progress', Math.round((e.loaded * 100) / e.total));
      }
    };
    const load = e => console.log('upload uploaded');
    
    const { promise } = this.props.uploadFile(params, progress, load);
    
  }
  
  render() {
    const s1 = {
      fontSize: '2rem',
      width: '60%',
      margin: '0 auto 0 auto',
    };
    
    return (
      <div style={s1}>    
      
        <h1>Aquest</h1>
        <Link to='/Explore'>Explore</Link>
        
        { this.renderLogin() }
        
        { /* temporary */ }
        <br/>
        <div>Wanna upload an image ?</div>  
        <input 
          type='file'
          id='inputFile'
          accept='image/*'
        />
        <button onClick={this.uploadImage.bind(this)}>Upload</button>
        
      </div>
    );
  }
}
