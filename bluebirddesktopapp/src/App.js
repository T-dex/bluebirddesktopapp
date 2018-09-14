import React, { Component } from 'react'
import firebase,{auth} from './firebase/firebase'
import Header from './header'
import { EventEmitter } from 'events'
import AddUser from './components/addUser'
import AddMedia from './components/addMedia'
import UpdateUser from './components/updateUser'
import NavBar from './components/navBar'
import './styles/app.css'

const date=  new Date()
const month = date.getMonth()+1
const updatedMonth= month < 10 ? '0'+month : month
const year = date.getFullYear()
const day= date.getDate()
const updatedDay=day < 10 ? "0"+ day : day
const currentDate= year + "-"+updatedMonth+"-"+updatedDay;
// // let user;
const rootRef=firebase.database().ref()
const storageRef= firebase.storage().ref()
const mainRef=rootRef.child('staging');
class App extends Component {
  constructor(){
    super() 
  this.state={
        production:{},
        user:null,
        uid:"",
        page:null,
        selectedPics:null
      }
      
  }
  componentDidMount(){
    mainRef.child('users').on('value', snap=>{
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
        mainRef.on('value', snap=>{
          const app=snap.val()
          console.log(app)
          const users={...app.users};
          const days={...app.days};
          const images={...app.images}
          this.setState({production:{users:users,days:days, images:images}})
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
  emptyFunction(newUserData){
    const email=newUserData.email
    const pass=newUserData.pass
    const packages= newUserData.packages
    const access=newUserData.admin

    
    
   const checkAuth=firebase.auth().createUserWithEmailAndPassword(email,pass).then(snap=>{
    let key=snap.user.uid
    const buildUser={
      email:email,
      uid:key,
      access:access,
      package:packages,
      remainingTrips:newUserData.trips
    }
    delete newUserData.pass
    const newUser=newUserData
    const newClient={...this.state.production.users,
      [key]:buildUser}
      console.log(newClient);
      
    this.setState(prevState=>({
      production:{
        ...prevState.production,
         users:newClient
       }
    }))
    mainRef.child('users/').set(newClient)
  })
   .catch(err=>console.log(err)
    )
  }

  removeUserDay=(remove)=>{
    const user= Object.keys(this.state.production.users).filter(key=>{
      if(key==remove){
       const removeUsersDay=this.state.production.users[key]
       const subDay=removeUsersDay.remainingTrips - 1
       const updatedUser={
         ...removeUsersDay,
         remainingTrips:subDay
       }
       const newUsers={
         ...this.state.production.users,
         [key]:updatedUser
       }
       this.setState(prevState=>({
         production:{
           ...prevState.production,
           users:newUsers
         }
       }))
       console.log(newUsers, updatedUser);
       mainRef.child('users/').set(newUsers)
        return key
      }
    })
    
    
  }
  addUserDay=(add)=>{
    const user= Object.keys(this.state.production.users).filter(key=>{
      if(key==add){
       const addUsersDay=this.state.production.users[key]
       const addDay=addUsersDay.remainingTrips + 1
       const updatedUser={
         ...addUsersDay,
         remainingTrips:addDay
       }
       const newUsers={
         ...this.state.production.users,
         [key]:updatedUser
       }
       this.setState(prevState=>({
         production:{
           ...prevState.production,
           users:newUsers
         }
       })) 
       mainRef.child('users/').set(newUsers)  
        return key
      }
    })
  }
  userScreen({ newLandingPage }) {
    if(this.state.user!==null){
    this.setState({ page: newLandingPage })}
  }
  fileUpload=(event)=>{
    this.setState({selectedPics:event.target.files[0]})
  
  }
  pictureUpload=(picData)=>{
    const userId=picData.userId
    const fd= new FormData();
    fd.append('image', this.state.selectedPics, this.state.selectedPics.name)
    let picName=this.state.selectedPics.name
    let file= this.state.selectedPics
    const metadata={
      contentType:'image/jpeg'
    }
    let refURL;
    let newRef= storageRef.child(picName).put(file, metadata).then(snapshot=>snapshot.ref.getDownloadURL().then(downloadURL=>{
      refURL=downloadURL
      let picId;
     mainRef.child('images').on('value',snap=>picId=snap.val()
     )
     const test=Object.keys(picId).map(key=>{
     if(key===userId){
      console.log("YEP");
     }else{
       const url=refURL
       const newUserPics={
         [userId]:{
           date:currentDate,
           url:url
         }
       }
       console.log(newUserPics);
       
     }
    })
     
//Logic needs to get figured out here. Just need to set the images up correctly. Will also need to adjust main page as it is not set up right
//Listening to Aha at sunset coffee if you need help with the head space

      

    })) 
  }
  render() {
  let mainArea;
  if(this.state.user!==null && this.state.page===2){
    mainArea=(
      <div className="mainArea">
      <div>
       <UpdateUser addUserDay={this.addUserDay} removeUserDay={this.removeUserDay} users={this.state.production.users}/>
      </div>
      </div>
    )
  }else if( this.state.user!==null && this.state.page===1){
    mainArea=(
    <div className="mainArea">
      <div>
      <AddUser emptyFunction={this.emptyFunction.bind(this)} />
      </div>
    </div>)
  }else if(this.state.user!==null && this.state.page===3){
    mainArea=(
      <div className="mainArea">
      <div>
      <AddMedia fileUpload={this.fileUpload} pictureUpload={this.pictureUpload} src={this.state.selectedPics}users={this.state.production.users}/>
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
