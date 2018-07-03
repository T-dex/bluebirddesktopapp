import React, { Component } from 'react'
import firebase,{auth} from './firebase/firebase'
import Header from './header'
import { EventEmitter } from 'events'
import AddUser from './components/addUser'
import AddMedia from './components/addMedia'
import UpdateUser from './components/updateUser'
import NavBar from './components/navBar'
import './styles/app.css'

class App extends Component {
  constructor(){
    super() 
  this.state={
        production:{},
        user:null,
        uid:"",
        page:null
      }
  }
  componentDidMount(){
    const rootRef=firebase.database().ref()
    const mainRef=rootRef.child('staging').child('users')
    mainRef.on('value', snap=>{
      this.setState({production:snap.val()})
    })
  }
  componentWillMount(){
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.addListener("landingPage", ({ page }) => {
      this.userScreen({ newLandingPage: page });
    });
  }
  logIn(user){
    const email=user.email
    const pass=user.pass
    const promise= auth.signInWithEmailAndPassword(email,pass)
    promise
    .then(snapshot=>{
      const userCheck=Object.keys(this.state.production).filter(key=>{if(this.state.production[key].email==snapshot.user.email){
       if(this.state.production[key].access=="admin"){
        const rootRef=firebase.database().ref()
        const mainRef= rootRef.child('staging')
        mainRef.on('value', snap=>{
          const app=snap.val()
          const users={...app.users};
          const days={...app.days};
          this.setState({production:{users:users,days:days}})
        })
        this.setState({user:email, uid:snapshot.user.uid})   
          
       return this.state.production[key]
        }
      }}
      )
    })
    .catch(error=>{
      console.log("Failed")
    });
  }
  userScreen({ newLandingPage }) {
    if(this.state.user!==null){
    this.setState({ page: newLandingPage })}
  }
  fileUpload=event=>{
    console.log(event);
    
  }
  render() {
  let mainArea;
  
  if(this.state.user!==null && this.state.page===1){
    mainArea=(
      <div className="mainArea">
      <div>
        {Object.keys(this.state.production).map(key=>{
          return <UpdateUser   key={key} users={this.state.production[key]}/>
        })}
      </div>
      </div>
    )
  }else if( this.state.user!==null && this.state.page===2){
    mainArea=(
    <div className="mainArea">
      <div>
      <AddUser/>
      </div>
    </div>)
  }else if(this.state.user!==null && this.state.page===3){
    mainArea=(
      <div className="mainArea">
      <div>
      <AddMedia fileUpload={this.fileUpload}/>
      </div>
    </div> 
    )
  }
    return (
      <div className="App">
        <Header className="header" user={this.state.user} logIn={this.logIn.bind(this)}/>
        <NavBar eventEmitter={this.eventEmitter}
            landingPage={this.state.page}/>
        {mainArea}
      </div>
    );
  }
}

export default App;
