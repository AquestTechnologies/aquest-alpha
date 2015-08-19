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
        <FileUploader uploadFile={this.props.uploadFile} />
        
        
      </div>
    );
  }
}

class FileUploader extends React.Component {
  constructor() {
    super();
    this.state = { message: 'Please select a file to upload' };
  }
  
  uploadImage() {
    
    const params = {
      file: document.getElementById('inputFile').files[0],
    };
    const progress = e => {
      if (e.lengthComputable) {
        this.setState({
          message: 'Uploading... ' + Math.round(e.loaded * 100 / e.total) + '%'
        });
      }
    };
    const load = e => this.setState({
      message: 'Upload complete, server is processing file...'
    });
    const onResponse = (done, result) => this.setState({
      message: done ? JSON.stringify(result) : ':( An error occured on server'
    });
    const action = this.props.uploadFile(params, progress, load, onResponse);
    // console.log('action', action); // Bug redux
    
  }
  
  render() {
    
    return <div>
      <div>Wanna upload ?</div>  
      <input 
        type='file'
        id='inputFile'
        accept='image/*'
      />
      <button onClick={this.uploadImage.bind(this)}>Upload</button>
      <br/>
      <div>{this.state.message}</div>
    </div>;
  }
}
