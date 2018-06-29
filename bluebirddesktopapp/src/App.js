import React, { Component } from 'react';
import firebase,{auth} from './firebase/firebase';
import Header from './header'
import './styles/app.css';

class App extends Component {
  constructor(){
    super();
      this.state={
        production:{},
        user:"",
        uid:"",
      }
  }
  componentDidMount(){
    const rootRef=firebase.database().ref();
    const mainRef=rootRef.child('staging').child('users');
    mainRef.on('value', snap=>{
      this.setState({production:snap.val()})
    })
  }
  logIn(user){
    const email=user.email;
    const pass=user.pass;
    const promise= auth.signInWithEmailAndPassword(email,pass);
    promise
    .then(snapshot=>{
      const userCheck=Object.keys(this.state.production).filter(key=>{if(this.state.production[key].email==snapshot.user.email){
       if(this.state.production[key].access=="admin"){
       return this.state.production[key]
        };
      }}
      );
      console.log(userCheck, this.state.production[userCheck]);
      
      
      
    })
    .catch(error=>{
      console.log("Failed");
      
    })
    
    

  }
  render() {
    return (
      <div className="App">
        <Header className="header" logIn={this.logIn.bind(this)}/>
      </div>
    );
  }
}

export default App;
