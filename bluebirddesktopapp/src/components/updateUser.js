import React, { Component } from 'react';
import { log } from 'util';


let data;
class UpdateUser extends Component{
    constructor(){
        super()
    }
componentDidMount(){
data=this.props.users
}
removeDay(event){
  console.log(event.target.value);
  console.log(data);
  
const remove= Object.keys(data).filter(key=>{
  if(data[key].email==event.target.value){
    console.log("AWWW SHIT MOTHER FUCKA!!! YOU REMOVEDEDED");
    return data[key]
    
  }
})
 console.log(remove);
 
}

addDay(event){
  const add= Object.keys(data).filter(key=>{
    if(data[key].email==event.target.value){
      console.log("AWWW SHIT MOTHER FUCKA!!! YOU ADDEDED!");
      return data[key]
      
    }
  })
   console.log(add);
   
 
}

 render(){
     const check=Object.keys(this.props.users).map(key=>this.props.users[key])
     const checker=Object.keys(check).map(key=>{
       return(
         <div className="userBlock">
           <h2>{check[key].email}</h2>
           <div className={check[key].access?"day-counter-admin":'day-counter'}><button onClick={this.removeDay} value={check[key].email}>&lt;</button><h4>{check[key].remainingTrips}</h4><button onClick={this.addDay} value={check[key].email}>&gt;</button></div>
        </div>
       )
     })

     
  return(
    <div>
      {checker}
    </div>
  )
 }
}
export default UpdateUser