import React, { Component } from 'react'
import { log } from 'util';
import uuid from 'uuid/v4'

class AddUser extends Component{
    constructor(){
        super();
        this.createNewUser=this.createNewUser.bind(this);
    }

createNewUser(event){
console.log(event);

event.preventDefault();
const email= this.refs.email.value;
const packages= this.refs.packages.value;
const id=uuid(id);
console.log(id);

let trips
let newUserData;
if(packages=="gold"){
trips=10
}else{
  trips=5
}
const amp= '@';
const checkEmail=email.split('');

if(checkEmail.includes(amp)){
  newUserData={email, packages, id, trips}
}
else{
  alert("Something ain't right please check your input")
}
this.props.emptyFunction(newUserData)
console.log(email, packages , trips);


}
 render(){
  return(
    <div>
        <input type="text" ref="email" placeholder="email"/>
        <select type="dropdown" ref="packages" >
        <option value= "gold">Gold</option>
        <option value= "silver">Silver</option>
        </select>
        <select type="dropdown" ref="packages" >
        <option value= "Access">Gold</option>
        <option value= "silver">Silver</option>
        </select>
        <button onClick={this.createNewUser}>Add New User</button>
    </div>
    
  )
 }
}
export default AddUser

