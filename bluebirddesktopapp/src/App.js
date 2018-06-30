import React, { Component } from 'react';
import firebase,{auth} from './firebase/firebase';
import Header from './header';
import AddUser from './components/addUser';
import UpdateUser from './components/updateUser'
import './styles/app.css';

class App extends Component {
  constructor(){
    super();
      this.state={
        production:{},
        user:null,
        uid:"",
      };
  }
  componentDidMount(){
    const rootRef=firebase.database().ref();
    const mainRef=rootRef.child('staging').child('users');
    mainRef.on('value', snap=>{
      this.setState({production:snap.val()});
    });
  }
  logIn(user){
    const email=user.email;
    const pass=user.pass;
    const promise= auth.signInWithEmailAndPassword(email,pass);
    promise
    .then(snapshot=>{
      const userCheck=Object.keys(this.state.production).filter(key=>{if(this.state.production[key].email==snapshot.user.email){
       if(this.state.production[key].access=="admin"){
        const rootRef=firebase.database().ref();
        const mainRef= rootRef.child('staging')
        mainRef.on('value', snap=>{
          const app=snap.val();
          const users={...app.users};
          const days={...app.days};
          this.setState({production:{users:users,days:days}});
        });
        this.setState({user:email, uid:snapshot.user.uid});   
          
       return this.state.production[key];
        }
      }}
      ); 
    })
    .catch(error=>{
      console.log("Failed")
    });
    
    

  }
  render() {
  let mainArea;
  
  if(this.state.user!==null){
    mainArea=(
      <div className="mainArea">
      <div>
        {Object.keys(this.state.production).map(key=>{
          return <UpdateUser   key={key} users={this.state.production[key]}/>
        })}
      </div>
      <div>
      <AddUser/>
      </div>
      </div>
    )
  }
    return (
      <div className="App">
        <Header className="header" user={this.state.user} logIn={this.logIn.bind(this)}/>
        {mainArea}
      </div>
    );
  }
}

export default App;
