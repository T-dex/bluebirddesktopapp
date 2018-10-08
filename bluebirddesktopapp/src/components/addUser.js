import React, { Component } from 'react'


class AddUser extends Component{
    constructor(){
        super()
        this.createNewUser=this.createNewUser.bind(this)
    }

createNewUser(event){
event.preventDefault()
const email= this.refs.email.value
const packages= this.refs.packages.value
const admin=this.refs.access.value
const pass= this.refs.pass.value
let trips
let newUserData
if(packages==='gold'&&admin!=='Admin'){
trips=10
}else if(packages==='silver'&&admin!=='Admin'){
  trips=5
}else{
  trips=null
}
const amp= '@'
const checkEmail=email.split('')

if(checkEmail.includes(amp)&&trips!=null){
  newUserData={email, packages,trips, admin, pass}
}else if(checkEmail.includes(amp)){
  newUserData={email,admin, pass}
}else{
  alert('Something aint right please check your input')
}
this.props.newUser(newUserData)


}
 render(){
  return(
    <div>
        <input type="text" ref="email" placeholder="email"/>
        <input type="text" ref="pass" placeholder="base password"/>
        <select type="dropdown" ref="packages" >
        <option value= "gold">Gold</option>
        <option value= "silver">Silver</option>
        </select>
        <select type="dropdown" ref="access" >
        <option value= "admin">Admin</option>
        <option value= "client">Client</option>
        </select>
        <button onClick={this.createNewUser}>Add New User</button>
    </div>
    
  )
 }
}
export default AddUser

